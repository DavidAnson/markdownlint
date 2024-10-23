// @ts-check

"use strict";

const micromark = require("markdownlint-micromark");
const { isHtmlFlowComment } = require("./micromark-helpers.cjs");
const { htmlFlowSymbol, newLineRe, tokenListsSymbol, tokenSequenceSymbol } = require("./shared.js");

/** @typedef {import("markdownlint-micromark").Construct} Construct */
/** @typedef {import("markdownlint-micromark").Event} Event */
/** @typedef {import("markdownlint-micromark").ParseOptions} MicromarkParseOptions */
/** @typedef {import("markdownlint-micromark").State} State */
/** @typedef {import("markdownlint-micromark").Token} Token */
/** @typedef {import("markdownlint-micromark").Tokenizer} Tokenizer */
/** @typedef {import("markdownlint-micromark").TokenType} TokenType */
/** @typedef {import("../lib/markdownlint.js").MicromarkToken} MicromarkToken */

/**
 * Parse options.
 *
 * @typedef {Object} ParseOptions
 * @property {boolean} [freezeTokens] Whether to freeze output Tokens.
 */

/**
 * Parses a Markdown document and returns Micromark events.
 *
 * @param {string} markdown Markdown document.
 * @param {MicromarkParseOptions} [micromarkParseOptions] Options for micromark.
 * @returns {Event[]} Micromark events.
 */
function getEvents(
  markdown,
  micromarkParseOptions = {}
) {
  // Customize extensions list to add useful extensions
  const extensions = [
    micromark.directive(),
    micromark.gfmAutolinkLiteral(),
    micromark.gfmFootnote(),
    micromark.gfmTable(),
    micromark.math(),
    ...(micromarkParseOptions.extensions || [])
  ];

  // // Shim labelEnd to identify undefined link labels
  /** @type {Event[][]} */
  const artificialEventLists = [];
  /** @type {Construct} */
  const labelEnd =
    // @ts-ignore
    micromark.labelEnd;
  const tokenizeOriginal = labelEnd.tokenize;

  /** @type {Tokenizer} */
  function tokenizeShim(effects, okOriginal, nokOriginal) {
    // eslint-disable-next-line consistent-this, unicorn/no-this-assignment, no-invalid-this
    const tokenizeContext = this;
    const events = tokenizeContext.events;

    /** @type {State} */
    const nokShim = (code) => {
      // Find start of label (image or link)
      let indexStart = events.length;
      while (--indexStart >= 0) {
        const event = events[indexStart];
        const [ kind, token ] = event;
        if (kind === "enter") {
          const { type } = token;
          if ((type === "labelImage") || (type === "labelLink")) {
            // Found it
            break;
          }
        }
      }

      // If found...
      if (indexStart >= 0) {
        // Create artificial enter/exit events and replicate all data/lineEnding events within
        const eventStart = events[indexStart];
        const [ , eventStartToken ] = eventStart;
        const eventEnd = events[events.length - 1];
        const [ , eventEndToken ] = eventEnd;
        /** @type {Token} */
        const undefinedReferenceType = {
          "type": "undefinedReferenceShortcut",
          "start": eventStartToken.start,
          "end": eventEndToken.end
        };
        /** @type {Token} */
        const undefinedReference = {
          "type": "undefinedReference",
          "start": eventStartToken.start,
          "end": eventEndToken.end
        };
        const eventsToReplicate = events
          .slice(indexStart)
          .filter((event) => {
            const [ , eventToken ] = event;
            const { type } = eventToken;
            return (type === "data") || (type === "lineEnding");
          });

        // Determine the type of the undefined reference
        const previousUndefinedEvent = (artificialEventLists.length > 0) && artificialEventLists[artificialEventLists.length - 1][0];
        const previousUndefinedToken = previousUndefinedEvent && previousUndefinedEvent[1];
        if (
          previousUndefinedToken &&
          (previousUndefinedToken.end.line === undefinedReferenceType.start.line) &&
          (previousUndefinedToken.end.column === undefinedReferenceType.start.column)
        ) {
          // Previous undefined reference event is immediately before this one
          if (eventsToReplicate.length === 0) {
            // The pair represent a collapsed reference (ex: [...][])
            previousUndefinedToken.type = "undefinedReferenceCollapsed";
            previousUndefinedToken.end = eventEndToken.end;
          } else {
            // The pair represent a full reference (ex: [...][...])
            undefinedReferenceType.type = "undefinedReferenceFull";
            undefinedReferenceType.start = previousUndefinedToken.start;
            artificialEventLists.pop();
          }
        }

        // Create artificial event list and replicate content
        const text = eventsToReplicate
          .filter((event) => event[0] === "enter")
          .map((event) => tokenizeContext.sliceSerialize(event[1]))
          .join("")
          .trim();
        if ((text.length > 0) && !text.includes("]")) {
          /** @type {Event[]} */
          const artificialEvents = [];
          artificialEvents.push(
            [ "enter", undefinedReferenceType, tokenizeContext ],
            [ "enter", undefinedReference, tokenizeContext ]
          );
          for (const event of eventsToReplicate) {
            const [ kind, token ] = event;
            // Copy token because the current object will get modified by the parser
            artificialEvents.push([ kind, { ...token }, tokenizeContext ]);
          }
          artificialEvents.push(
            [ "exit", undefinedReference, tokenizeContext ],
            [ "exit", undefinedReferenceType, tokenizeContext ]
          );
          artificialEventLists.push(artificialEvents);
        }
      }

      // Continue with original behavior
      return nokOriginal(code);
    };

    // Shim nok handler of labelEnd's tokenize
    return tokenizeOriginal.call(tokenizeContext, effects, okOriginal, nokShim);
  }

  try {
    // Shim labelEnd behavior to detect undefined references
    labelEnd.tokenize = tokenizeShim;

    // Use micromark to parse document into Events
    const encoding = undefined;
    const eol = true;
    const parseContext = micromark.parse({ ...micromarkParseOptions, extensions });
    const chunks = micromark.preprocess()(markdown, encoding, eol);
    const events = micromark.postprocess(parseContext.document().write(chunks));

    // Append artificial events and return all events
    // eslint-disable-next-line unicorn/prefer-spread
    return events.concat(...artificialEventLists);
  } finally {
    // Restore shimmed labelEnd behavior
    labelEnd.tokenize = tokenizeOriginal;
  }
}

/**
 * Gets the sequence number for a token list map.
 *
 * @param {Map<TokenType, MicromarkToken[]>} tokenLists Token list map.
 * @returns {number} Sequence number.
 */
function getSequence(tokenLists) {
  let sequence = 0;
  for (const tokenList of tokenLists.values()) {
    sequence += tokenList.length;
  }
  return sequence;
}

/**
 * Parses a Markdown document and returns micromark tokens (internal).
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} [parseOptions] Options.
 * @param {MicromarkParseOptions} [micromarkParseOptions] Options for micromark.
 * @param {number} [lineDelta] Offset for start/end line.
 * @param {Map<TokenType, MicromarkToken[]>} [tokenLists] Token list map.
 * @param {MicromarkToken} [ancestor] Parent of top-most tokens.
 * @returns {MicromarkToken[]} Micromark tokens.
 */
function parseInternal(
  markdown,
  parseOptions = {},
  micromarkParseOptions = {},
  lineDelta = 0,
  tokenLists = new Map(),
  ancestor = undefined
) {
  // Get options
  const freezeTokens = Boolean(parseOptions.freezeTokens);

  // Use micromark to parse document into Events
  const events = getEvents(markdown, micromarkParseOptions);

  // Create Token objects
  const document = [];
  let sequence = getSequence(tokenLists);
  /** @type {MicromarkToken} */
  const root = {
    "type": "data",
    "startLine": -1,
    "startColumn": -1,
    "endLine": -1,
    "endColumn": -1,
    "text": "ROOT",
    "children": document,
    "parent": null
  };
  const history = [ root ];
  let current = root;
  // eslint-disable-next-line jsdoc/valid-types
  /** @type MicromarkParseOptions | null */
  let reparseOptions = null;
  let lines = null;
  let skipHtmlFlowChildren = false;
  for (const event of events) {
    const [ kind, token, context ] = event;
    const { type, start, end } = token;
    const { "column": startColumn, "line": startLine } = start;
    const { "column": endColumn, "line": endLine } = end;
    const text = context.sliceSerialize(token);
    if ((kind === "enter") && !skipHtmlFlowChildren) {
      const previous = current;
      history.push(previous);
      current = {
        type,
        "startLine": startLine + lineDelta,
        startColumn,
        "endLine": endLine + lineDelta,
        endColumn,
        text,
        "children": [],
        "parent": ((previous === root) ? (ancestor || null) : previous)
      };
      Object.defineProperty(current, tokenSequenceSymbol, { "value": sequence++ });
      if (ancestor) {
        Object.defineProperty(current, htmlFlowSymbol, { "value": true });
      }
      previous.children.push(current);
      const tokenList = tokenLists.get(type) || [];
      tokenList.push(current);
      tokenLists.set(type, tokenList);
      if ((current.type === "htmlFlow") && !isHtmlFlowComment(current)) {
        skipHtmlFlowChildren = true;
        if (!reparseOptions || !lines) {
          reparseOptions = {
            ...micromarkParseOptions,
            "extensions": [
              {
                "disable": {
                  "null": [ "codeIndented", "htmlFlow" ]
                }
              }
            ]
          };
          lines = markdown.split(newLineRe);
        }
        const reparseMarkdown = lines
          .slice(current.startLine - 1, current.endLine)
          .join("\n");
        const tokens = parseInternal(
          reparseMarkdown,
          parseOptions,
          reparseOptions,
          current.startLine - 1,
          tokenLists,
          current
        );
        current.children = tokens;
        // Reset sequence
        sequence = getSequence(tokenLists);
      }
    } else if (kind === "exit") {
      if (type === "htmlFlow") {
        skipHtmlFlowChildren = false;
      }
      if (!skipHtmlFlowChildren) {
        if (freezeTokens) {
          Object.freeze(current.children);
          Object.freeze(current);
        }
        // @ts-ignore
        current = history.pop();
      }
    }
  }

  // Return document
  Object.defineProperty(document, tokenListsSymbol, { "value": tokenLists });
  if (freezeTokens) {
    Object.freeze(document);
  }
  return document;
}

/**
 * Parses a Markdown document and returns micromark tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} [parseOptions] Options.
 * @returns {MicromarkToken[]} Micromark tokens.
 */
function parse(markdown, parseOptions) {
  return parseInternal(markdown, parseOptions);
}

module.exports = {
  getEvents,
  parse
};

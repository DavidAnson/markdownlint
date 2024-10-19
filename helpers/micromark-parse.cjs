// @ts-check

"use strict";

const micromark = require("markdownlint-micromark");
const { isHtmlFlowComment } = require("./micromark-helpers.cjs");
const { flatTokensSymbol, htmlFlowSymbol, newLineRe } = require("./shared.js");

/** @typedef {import("markdownlint-micromark").Event} Event */
/** @typedef {import("markdownlint-micromark").ParseOptions} MicromarkParseOptions */
/** @typedef {import("../lib/markdownlint.js").MicromarkToken} MicromarkToken */

/**
 * Parse options.
 *
 * @typedef {Object} ParseOptions
 * @property {boolean} [freezeTokens] Whether to freeze output Tokens.
 * @property {boolean} [shimReferences] Whether to shim missing references.
 */

/**
 * Parses a Markdown document and returns Micromark events.
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} [parseOptions] Options.
 * @param {MicromarkParseOptions} [micromarkParseOptions] Options for micromark.
 * @returns {Event[]} Micromark events.
 */
function getEvents(
  markdown,
  parseOptions = {},
  micromarkParseOptions = {}
) {
  // Get options
  const shimReferences = Boolean(parseOptions.shimReferences);

  // Customize options object to add useful extensions
  micromarkParseOptions.extensions = micromarkParseOptions.extensions || [];
  micromarkParseOptions.extensions.push(
    micromark.directive(),
    micromark.gfmAutolinkLiteral(),
    micromark.gfmFootnote(),
    micromark.gfmTable(),
    micromark.math()
  );

  // Use micromark to parse document into Events
  const encoding = undefined;
  const eol = true;
  const parseContext = micromark.parse(micromarkParseOptions);
  if (shimReferences) {
    // Customize ParseContext to treat all references as defined
    parseContext.defined.includes = (searchElement) => searchElement.length > 0;
  }
  const chunks = micromark.preprocess()(markdown, encoding, eol);
  const events = micromark.postprocess(parseContext.document().write(chunks));
  return events;
}

/**
 * Parses a Markdown document and returns micromark tokens (internal).
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} [parseOptions] Options.
 * @param {MicromarkParseOptions} [micromarkParseOptions] Options for micromark.
 * @param {number} [lineDelta] Offset for start/end line.
 * @param {MicromarkToken} [ancestor] Parent of top-most tokens.
 * @returns {MicromarkToken[]} Micromark tokens.
 */
function parseInternal(
  markdown,
  parseOptions = {},
  micromarkParseOptions = {},
  lineDelta = 0,
  ancestor = undefined
) {
  // Get options
  const freezeTokens = Boolean(parseOptions.freezeTokens);

  // Use micromark to parse document into Events
  const events = getEvents(markdown, parseOptions, micromarkParseOptions);

  // Create Token objects
  const document = [];
  let flatTokens = [];
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
      if (ancestor) {
        Object.defineProperty(current, htmlFlowSymbol, { "value": true });
      }
      previous.children.push(current);
      flatTokens.push(current);
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
          current
        );
        current.children = tokens;
        // Avoid stack overflow of Array.push(...spread)
        // eslint-disable-next-line unicorn/prefer-spread
        flatTokens = flatTokens.concat(tokens[flatTokensSymbol]);
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
  Object.defineProperty(document, flatTokensSymbol, { "value": flatTokens });
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

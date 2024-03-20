// @ts-check

"use strict";

// @ts-ignore
const {
  directive, gfmAutolinkLiteral, gfmFootnote, gfmTable, math,
  parse, postprocess, preprocess
  // @ts-ignore
} = require("markdownlint-micromark");
const { newLineRe } = require("./shared.js");

const flatTokensSymbol = Symbol("flat-tokens");

/** @typedef {import("markdownlint-micromark").Event} Event */
/** @typedef {import("markdownlint-micromark").ParseOptions} ParseOptions */
/** @typedef {import("markdownlint-micromark").TokenType} TokenType */
/** @typedef {import("../lib/markdownlint.js").MicromarkToken} Token */

/**
 * Returns whether a token is an htmlFlow type containing an HTML comment.
 *
 * @param {Token} token Micromark token.
 * @returns {boolean} True iff token is htmlFlow containing a comment.
 */
function isHtmlFlowComment(token) {
  const { text, type } = token;
  if (
    (type === "htmlFlow") &&
    text.startsWith("<!--") &&
    text.endsWith("-->")
  ) {
    const comment = text.slice(4, -3);
    return (
      !comment.startsWith(">") &&
      !comment.startsWith("->") &&
      !comment.endsWith("-")
      // The following condition from the CommonMark specification is commented
      // to avoid parsing HTML comments that include "--" because that is NOT a
      // condition of the HTML specification.
      // https://spec.commonmark.org/0.30/#raw-html
      // https://html.spec.whatwg.org/multipage/syntax.html#comments
      // && !comment.includes("--")
    );
  }
  return false;
}

/**
 * Parses a Markdown document and returns Micromark events.
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} [micromarkOptions] Options for micromark.
 * @param {boolean} [referencesDefined] Treat references as defined.
 * @returns {Event[]} Micromark events.
 */
function getMicromarkEvents(
  markdown,
  micromarkOptions = {},
  referencesDefined = true
) {

  // Customize options object to add useful extensions
  micromarkOptions.extensions = micromarkOptions.extensions || [];
  micromarkOptions.extensions.push(
    directive(),
    gfmAutolinkLiteral(),
    gfmFootnote(),
    gfmTable(),
    math()
  );

  // Use micromark to parse document into Events
  const encoding = undefined;
  const eol = true;
  const parseContext = parse(micromarkOptions);
  if (referencesDefined) {
    // Customize ParseContext to treat all references as defined
    parseContext.defined.includes = (searchElement) => searchElement.length > 0;
  }
  const chunks = preprocess()(markdown, encoding, eol);
  const events = postprocess(parseContext.document().write(chunks));
  return events;
}

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} micromarkOptions Options for micromark.
 * @param {boolean} referencesDefined Treat references as defined.
 * @param {number} lineDelta Offset to apply to start/end line.
 * @param {Token} [ancestor] Parent of top-most tokens.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParseWithOffset(
  markdown,
  micromarkOptions,
  referencesDefined,
  lineDelta,
  ancestor
) {
  // Use micromark to parse document into Events
  const events = getMicromarkEvents(
    markdown, micromarkOptions, referencesDefined
  );

  // Create Token objects
  const document = [];
  let flatTokens = [];
  /** @type {Token} */
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
  /** @type ParseOptions | null */
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
      previous.children.push(current);
      flatTokens.push(current);
      if ((current.type === "htmlFlow") && !isHtmlFlowComment(current)) {
        skipHtmlFlowChildren = true;
        if (!reparseOptions || !lines) {
          reparseOptions = {
            ...micromarkOptions,
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
        const tokens = micromarkParseWithOffset(
          reparseMarkdown,
          reparseOptions,
          referencesDefined,
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
        Object.freeze(current.children);
        Object.freeze(current);
        // @ts-ignore
        current = history.pop();
      }
    }
  }

  // Return document
  Object.defineProperty(document, flatTokensSymbol, { "value": flatTokens });
  Object.freeze(document);
  return document;
}

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} [micromarkOptions] Options for micromark.
 * @param {boolean} [referencesDefined] Treat references as defined.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParse(
  markdown,
  micromarkOptions = {},
  referencesDefined = true
) {
  return micromarkParseWithOffset(
    markdown,
    micromarkOptions,
    referencesDefined,
    0
  );
}

/**
 * @callback AllowedPredicate
 * @param {Token} token Micromark token.
 * @returns {boolean} True iff allowed.
 */

/**
 * @callback TransformPredicate
 * @param {Token} token Micromark token.
 * @returns {Token[]} Child tokens.
 */

/**
 * Filter a list of Micromark tokens by predicate.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {AllowedPredicate} [allowed] Allowed token predicate.
 * @param {TransformPredicate} [transformChildren] Transform predicate.
 * @returns {Token[]} Filtered tokens.
 */
function filterByPredicate(tokens, allowed, transformChildren) {
  allowed = allowed || (() => true);
  const result = [];
  const queue = [
    {
      "array": tokens,
      "index": 0
    }
  ];
  while (queue.length > 0) {
    const current = queue[queue.length - 1];
    const { array, index } = current;
    if (index < array.length) {
      const token = array[current.index++];
      if (allowed(token)) {
        result.push(token);
      }
      const { children } = token;
      if (children.length > 0) {
        const transformed =
          transformChildren ? transformChildren(token) : children;
        queue.push(
          {
            "array": transformed,
            "index": 0
          }
        );
      }
    } else {
      queue.pop();
    }
  }
  return result;
}

/**
 * Filter a list of Micromark tokens by type.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {TokenType[]} types Types to allow.
 * @returns {Token[]} Filtered tokens.
 */
function filterByTypes(tokens, types) {
  const predicate = (token) => types.includes(token.type);
  const flatTokens = tokens[flatTokensSymbol];
  if (flatTokens) {
    return flatTokens.filter(predicate);
  }
  return filterByPredicate(tokens, predicate);
}

/**
 * Gets the heading level of a Micromark heading tokan.
 *
 * @param {Token} heading Micromark heading token.
 * @returns {number} Heading level.
 */
function getHeadingLevel(heading) {
  const headingSequence = filterByTypes(
    heading.children,
    [ "atxHeadingSequence", "setextHeadingLineSequence" ]
  );
  let level = 1;
  const { text } = headingSequence[0];
  if (text[0] === "#") {
    level = Math.min(text.length, 6);
  } else if (text[0] === "-") {
    level = 2;
  }
  return level;
}

/**
 * HTML tag information.
 *
 * @typedef {Object} HtmlTagInfo
 * @property {boolean} close True iff close tag.
 * @property {string} name Tag name.
 */

/**
 * Gets information about the tag in an HTML token.
 *
 * @param {Token} token Micromark token.
 * @returns {HtmlTagInfo | null} HTML tag information.
 */
function getHtmlTagInfo(token) {
  const htmlTagNameRe = /^<([^!>][^/\s>]*)/;
  if (token.type === "htmlText") {
    const match = htmlTagNameRe.exec(token.text);
    if (match) {
      const name = match[1];
      const close = name.startsWith("/");
      return {
        close,
        "name": close ? name.slice(1) : name
      };
    }
  }
  return null;
}

/**
 * Gets the nearest parent of the specified type for a Micromark token.
 *
 * @param {Token} token Micromark token.
 * @param {TokenType[]} types Types to allow.
 * @returns {Token | null} Parent token.
 */
function getTokenParentOfType(token, types) {
  /** @type {Token | null} */
  let current = token;
  while ((current = current.parent) && !types.includes(current.type)) {
    // Empty
  }
  return current;
}

/**
 * Get the text of the first match from a list of Micromark tokens by type.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {TokenType} type Type to match.
 * @returns {string | null} Text of token.
 */
function getTokenTextByType(tokens, type) {
  const filtered = tokens.filter((token) => token.type === type);
  return (filtered.length > 0) ? filtered[0].text : null;
}

/**
 * Determines if a Micromark token has an htmlFlow-type parent.
 *
 * @param {Token} token Micromark token.
 * @returns {boolean} True iff the token has an htmlFlow-type parent.
 */
function inHtmlFlow(token) {
  return getTokenParentOfType(token, [ "htmlFlow" ]) !== null;
}

/**
 * Determines a list of Micromark tokens matches and returns a subset.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {TokenType[]} matchTypes Types to match.
 * @param {TokenType[]} [resultTypes] Types to return.
 * @returns {Token[] | null} Matching tokens.
 */
function matchAndGetTokensByType(tokens, matchTypes, resultTypes) {
  if (tokens.length !== matchTypes.length) {
    return null;
  }
  resultTypes = resultTypes || matchTypes;
  const result = [];
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < matchTypes.length; i++) {
    if (tokens[i].type !== matchTypes[i]) {
      return null;
    } else if (resultTypes.includes(matchTypes[i])) {
      result.push(tokens[i]);
    }
  }
  return result;
}

/**
 * Returns the specified token iff it is of the desired type.
 *
 * @param {Token} token Micromark token candidate.
 * @param {TokenType} type Desired type.
 * @returns {Token | null} Token instance.
 */
function tokenIfType(token, type) {
  return (token && (token.type === type)) ? token : null;
}

/**
 * Set containing token types that do not contain content.
 *
 * @type {Set<TokenType>}
 */
const nonContentTokens = new Set([
  "blockQuoteMarker",
  "blockQuotePrefix",
  "blockQuotePrefixWhitespace",
  "lineEnding",
  "lineEndingBlank",
  "linePrefix",
  "listItemIndent"
]);

module.exports = {
  "parse": micromarkParse,
  filterByPredicate,
  filterByTypes,
  getHeadingLevel,
  getHtmlTagInfo,
  getMicromarkEvents,
  getTokenParentOfType,
  getTokenTextByType,
  inHtmlFlow,
  isHtmlFlowComment,
  matchAndGetTokensByType,
  nonContentTokens,
  tokenIfType
};

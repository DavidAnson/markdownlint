// @ts-check

"use strict";

// @ts-ignore
const {
  gfmAutolinkLiteral, gfmFootnote, gfmTable, math, parse, postprocess,
  preprocess
  // @ts-ignore
} = require("markdownlint-micromark");
const { newLineRe } = require("./shared.js");

/**
 * Markdown token.
 *
 * @typedef {Object} Token
 * @property {string} type Token type.
 * @property {number} startLine Start line (1-based).
 * @property {number} startColumn Start column (1-based).
 * @property {number} endLine End line (1-based).
 * @property {number} endColumn End column (1-based).
 * @property {string} text Token text.
 * @property {Token[]} children Child tokens.
 * @property {Token[]} [htmlFlowChildren] Child tokens for htmlFlow.
 */

/**
 * Parses a Markdown document and returns Micromark events.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} [micromarkOptions] Options for micromark.
 * @param {boolean} [referencesDefined] Treat references as defined.
 * @returns {Object[]} Micromark events.
 */
function getMicromarkEvents(
  markdown,
  micromarkOptions = {},
  referencesDefined = true
) {

  // Customize options object to add useful extensions
  micromarkOptions.extensions = micromarkOptions.extensions || [];
  micromarkOptions.extensions.push(
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
 * @param {Object} micromarkOptions Options for micromark.
 * @param {boolean} referencesDefined Treat references as defined.
 * @param {number} lineDelta Offset to apply to start/end line.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParseWithOffset(
  markdown,
  micromarkOptions,
  referencesDefined,
  lineDelta
) {
  // Use micromark to parse document into Events
  const events = getMicromarkEvents(
    markdown, micromarkOptions, referencesDefined
  );

  // Create Token objects
  const document = [];
  let current = {
    "children": document
  };
  const history = [ current ];
  let reparseOptions = null;
  let lines = null;
  for (const event of events) {
    const [ kind, token, context ] = event;
    const { type, start, end } = token;
    const { "column": startColumn, "line": startLine } = start;
    const { "column": endColumn, "line": endLine } = end;
    const text = context.sliceSerialize(token);
    if (kind === "enter") {
      const previous = current;
      history.push(previous);
      current = {
        type,
        "startLine": startLine + lineDelta,
        startColumn,
        "endLine": endLine + lineDelta,
        endColumn,
        text,
        "children": []
      };
      if (current.type === "htmlFlow") {
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
        current.htmlFlowChildren = micromarkParseWithOffset(
          reparseMarkdown,
          reparseOptions,
          referencesDefined,
          current.startLine - 1
        );
      }
      previous.children.push(current);
    } else if (kind === "exit") {
      Object.freeze(current.children);
      Object.freeze(current);
      // @ts-ignore
      current = history.pop();
    }
  }

  // Return document
  Object.freeze(document);
  return document;
}

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} [micromarkOptions] Options for micromark.
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
 * Filter a list of Micromark tokens by predicate.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {Function} allowed Allowed token predicate.
 * @param {Function} [transformChildren] Transform children predicate.
 * @returns {Token[]} Filtered tokens.
 */
function filterByPredicate(tokens, allowed, transformChildren) {
  const result = [];
  const pending = [ ...tokens ];
  let token = null;
  while ((token = pending.shift())) {
    if (allowed(token)) {
      result.push(token);
    }
    if (token.children.length > 0) {
      const transformed =
        transformChildren ? transformChildren(token) : token.children;
      pending.unshift(...transformed);
    }
  }
  return result;
}

/**
 * Filter a list of Micromark tokens by type.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {string[]} allowed Types to allow.
 * @returns {Token[]} Filtered tokens.
 */
function filterByTypes(tokens, allowed) {
  return filterByPredicate(
    tokens,
    (token) => allowed.includes(token.type)
  );
}

/**
 * Filter a list of Micromark tokens for HTML tokens.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @returns {Token[]} Filtered tokens.
 */
function filterByHtmlTokens(tokens) {
  const result = [];
  const pending = [ tokens ];
  let current = null;
  while ((current = pending.shift())) {
    for (const token of filterByTypes(current, [ "htmlFlow", "htmlText" ])) {
      if (token.type === "htmlText") {
        result.push(token);
      } else {
        // token.type === "htmlFlow"
        // @ts-ignore
        pending.push(token.htmlFlowChildren);
      }
    }
  }
  return result;
}

/**
 * Returns a list of all nested child tokens.
 *
 * @param {Token} parent Micromark token.
 * @returns {Token[]} Flattened children.
 */
function flattenedChildren(parent) {
  const result = [];
  const pending = [ ...parent.children ];
  let token = null;
  while ((token = pending.shift())) {
    result.push(token);
    pending.unshift(...token.children);
  }
  return result;
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
 * Gets information about the tag in an HTML token.
 *
 * @param {Token} token Micromark token.
 * @returns {Object | null} HTML tag information.
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
 * Get the text of a single token from a list of Micromark tokens by type.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {string} type Types to match.
 * @returns {string | null} Text of token.
 */
function getTokenTextByType(tokens, type) {
  const filtered = tokens.filter((token) => token.type === type);
  return (filtered.length === 1) ? filtered[0].text : null;
}

/**
 * Determines a list of Micromark tokens matches and returns a subset.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {string[]} matchTypes Types to match.
 * @param {string[]} [resultTypes] Types to return.
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
 * @param {string} type Desired type.
 * @returns {Token | null} Token instance.
 */
function tokenIfType(token, type) {
  return (token && (token.type === type)) ? token : null;
}

module.exports = {
  "parse": micromarkParse,
  filterByHtmlTokens,
  filterByPredicate,
  filterByTypes,
  flattenedChildren,
  getHeadingLevel,
  getHtmlTagInfo,
  getMicromarkEvents,
  getTokenTextByType,
  matchAndGetTokensByType,
  tokenIfType
};

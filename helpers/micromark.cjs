// @ts-check

"use strict";

// @ts-ignore
const {
  gfmAutolinkLiteral, gfmFootnote, gfmTable, parse, postprocess, preprocess
  // @ts-ignore
} = require("markdownlint-micromark");

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
 */

/**
 * Parses a Markdown document and returns Micromark events.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} [options] Options for micromark.
 * @returns {Object[]} Micromark events.
 */
function getMicromarkEvents(markdown, options = {}) {

  // Customize options object to add useful extensions
  options.extensions = options.extensions || [];
  options.extensions.push(gfmAutolinkLiteral, gfmFootnote(), gfmTable);

  // Use micromark to parse document into Events
  const encoding = undefined;
  const eol = true;
  const parseContext = parse(options);
  // Customize ParseContext to treat all references as defined
  parseContext.defined.includes = (searchElement) => searchElement.length > 0;
  const chunks = preprocess()(markdown, encoding, eol);
  const events = postprocess(parseContext.document().write(chunks));
  return events;
}

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} [options] Options for micromark.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParse(markdown, options = {}) {

  // Use micromark to parse document into Events
  const events = getMicromarkEvents(markdown, options);

  // Create Token objects
  const document = [];
  let current = {
    "children": document
  };
  const history = [ current ];
  for (const event of events) {
    const [ kind, token, context ] = event;
    const { type, start, end } = token;
    const { "column": startColumn, "line": startLine } = start;
    const { "column": endColumn, "line": endLine } = end;
    let text = null;
    try {
      text = context.sliceSerialize(token);
    } catch {
      // https://github.com/micromark/micromark/issues/131
    }
    if (kind === "enter") {
      const previous = current;
      history.push(previous);
      current = {
        type,
        startLine,
        startColumn,
        endLine,
        endColumn,
        text,
        "children": []
      };
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

module.exports = {
  "parse": micromarkParse,
  filterByPredicate,
  filterByTypes,
  getHtmlTagInfo,
  getMicromarkEvents,
  getTokenTextByType,
  matchAndGetTokensByType
};

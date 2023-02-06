// @ts-check

"use strict";

/* eslint-disable n/no-unpublished-require */

// @ts-ignore
const { gfmAutolinkLiteral, gfmFootnote, parse, postprocess, preprocess } =
  require("../micromark/micromark.cjs");

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
 * @property {Token[]} tokens Child tokens.
 */

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} [options] Options for micromark.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParse(markdown, options = {}) {

  // Customize options object to add useful extensions
  options.extensions ||= [];
  options.extensions.push(gfmAutolinkLiteral, gfmFootnote());

  // Use micromark to parse document into Events
  const encoding = undefined;
  const eol = true;
  const parseContext = parse(options);
  // Customize ParseContext to treat all references as defined
  parseContext.defined.includes = (searchElement) => searchElement.length > 0;
  const chunks = preprocess()(markdown, encoding, eol);
  const events = postprocess(parseContext.document().write(chunks));

  // Create Token objects
  const document = [];
  let current = {
    "tokens": document
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
        "tokens": []
      };
      previous.tokens.push(current);
    } else if (kind === "exit") {
      Object.freeze(current.tokens);
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
 * @param {Function} [transform] Transform token list predicate.
 * @returns {Token[]} Filtered tokens.
 */
function filterByPredicate(tokens, allowed, transform) {
  const result = [];
  const pending = [ ...tokens ];
  let token = null;
  while ((token = pending.shift())) {
    if (allowed(token)) {
      result.push(token);
    }
    const transformed = transform ? transform(token.tokens) : token.tokens;
    pending.unshift(...transformed);
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
      }
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
 * @returns {Object | null} Matching tokens by type.
 */
function matchAndGetTokensByType(tokens, matchTypes, resultTypes) {
  if (tokens.length !== matchTypes.length) {
    return null;
  }
  resultTypes ||= matchTypes;
  const result = {};
  for (let i = 0; i < matchTypes.length; i++) {
    if (tokens[i].type !== matchTypes[i]) {
      return null;
    } else if (resultTypes.includes(matchTypes[i])) {
      result[matchTypes[i]] = tokens[i];
    }
  }
  return result;
}

module.exports = {
  "parse": micromarkParse,
  filterByPredicate,
  filterByTypes,
  getHtmlTagInfo,
  getTokenTextByType,
  matchAndGetTokensByType
};

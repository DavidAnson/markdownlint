// @ts-check

"use strict";

/* eslint-disable n/no-unpublished-require */

// @ts-ignore
const { parse, postprocess, preprocess } = require("../micromark/micromark.cjs");

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
 * @returns {Token[]} Markdown tokens (frozen).
 */
function micromarkParse(markdown) {

  // Use micromark to parse document into Events
  const encoding = undefined;
  const eol = true;
  const options = undefined;
  const chunks = preprocess()(markdown, encoding, eol);
  const parseContext = parse(options).document().write(chunks);
  const events = postprocess(parseContext);

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

module.exports = {
  "parse": micromarkParse
};

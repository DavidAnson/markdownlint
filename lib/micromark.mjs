// @ts-check

import assert from "node:assert/strict";
// eslint-disable-next-line n/no-unpublished-import
import { parse, postprocess, preprocess } from "../micromark/exports.mjs";

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
 * Parses a Markdown document and returns tokens.
 *
 * @param {string} markdown Markdown document.
 * @returns {Token[]} Markdown tokens.
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
    const { type, start, end, _container } = token;
    const { "column": startColumn, "line": startLine } = start;
    const { "column": endColumn, "line": endLine } = end;
    // sliceSerialize throws when called for a _container
    const text = _container ? null : context.sliceSerialize(token);
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
      assert.equal(type, current.type);
      assert.equal(startLine, current.startLine);
      assert.equal(startColumn, current.startColumn);
      assert.equal(endLine, current.endLine);
      assert.equal(endColumn, current.endColumn);
      assert.equal(text, current.text);
      // @ts-ignore
      current = history.pop();
      assert.ok(current, "Empty history");
    }
  }

  // Return document
  return document;
}

export {
  micromarkParse as parse
};

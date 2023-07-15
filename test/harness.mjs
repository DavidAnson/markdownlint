import { readFile } from "node:fs/promises";
import { parse } from "../helpers/micromark.cjs";
import library from "../lib/markdownlint.js";
const markdownlint = library.promises.markdownlint;

/* eslint-disable no-await-in-loop, no-console */

/**
 * Log the structure of a Micromark token list.
 *
 * @param {Object[]} tokens Micromark tokens.
 * @param {number} depth Tree depth.
 * @returns {void}
 */
function consoleLogTokens(tokens, depth = 0) {
  for (const token of tokens) {
    const { children, text, type } = token;
    console.log(
      `${" ".repeat(depth * 2)}${type} ${text.replace(/\n/g, "\\n")}`
    );
    if (children.length > 0) {
      consoleLogTokens(children, depth + 1);
    }
  }
}

const files = process.argv.slice(2);
for (const file of files) {
  const content = await readFile(file);
  consoleLogTokens(parse(content));
  const results = await markdownlint({
    "files": [ file ]
  });
  console.dir(results, { "depth": null });
}

import { readFile } from "node:fs/promises";
import { lint } from "markdownlint/promise";
import { parse } from "../lib/micromark-parse.mjs";

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

let profile = false;
let count = 1;
const files = process.argv.slice(2).filter((arg) => {
  if (arg === "--profile") {
    profile = true;
    count = 1000;
    return false;
  }
  return true;
});

for (const file of files) {
  if (!profile) {
    const content = await readFile(file, "utf8");
    consoleLogTokens(parse(content));
  }
  let results = null;
  performance.mark("profile-start");
  for (let i = 0; i < count; i++) {
    results = await lint({
      "files": [ file ]
    });
  }
  const measure = performance.measure("profile", "profile-start");
  if (profile) {
    console.log(Math.round(measure.duration));
  } else {
    console.dir(results, { "depth": null });
  }
}

// @ts-check

"use strict";

/** @type {import("markdownlint").Rule} */
module.exports = {
  "names": [ "letters-E-X", "letter-E-letter-X", "contains-ex" ],
  "description": "Rule that reports an error for lines with the letters 'EX'",
  "information": new URL(
    "https://github.com/DavidAnson/markdownlint" +
    "/blob/main/test/rules/letters-E-X.js"
  ),
  "tags": [ "test" ],
  "parser": "markdownit",
  "function": (params, onError) => {
    for (const inline of params.parsers.markdownit.tokens.filter(
      (token) => token.type === "inline"
    )) {
      for (const text of inline.children.filter(
        (child) => child.type === "text"
      )) {
        const index = text.content.toLowerCase().indexOf("ex");
        if (index !== -1) {
          onError({
            "lineNumber": text.lineNumber,
            "context": text.content.substr(index - 1, 4)
          });
        }
      }
    }
  }
};

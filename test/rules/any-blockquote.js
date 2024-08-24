// @ts-check

"use strict";

/** @type import("../../lib/markdownlint").Rule */
module.exports = {
  "names": [ "any-blockquote" ],
  "description": "Rule that reports an error for any blockquote",
  "information": new URL(
    "https://github.com/DavidAnson/markdownlint" +
    "/blob/main/test/rules/any-blockquote.js"
  ),
  "tags": [ "test" ],
  "parser": "markdownit",
  "function": (params, onError) => {
    const blockquotes = params.parsers.markdownit.tokens.
      filter((token => token.type === "blockquote_open"));
    for (const blockquote of blockquotes) {
      const lines = blockquote.map[1] - blockquote.map[0];
      onError({
        "lineNumber": blockquote.lineNumber,
        "detail": "Blockquote spans " + lines + " line(s).",
        "context": blockquote.line.substr(0, 7)
      });
    }
  }
};

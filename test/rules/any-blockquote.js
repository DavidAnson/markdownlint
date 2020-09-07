// @ts-check

"use strict";

const { filterTokens } = require("markdownlint-rule-helpers");

module.exports = {
  "names": [ "any-blockquote" ],
  "description": "Rule that reports an error for any blockquote",
  "information": new URL(
    "https://github.com/DavidAnson/markdownlint" +
    "/blob/main/test/rules/any-blockquote.js"
  ),
  "tags": [ "test" ],
  "function": (params, onError) => {
    filterTokens(params, "blockquote_open", (blockquote) => {
      const lines = blockquote.map[1] - blockquote.map[0];
      onError({
        "lineNumber": blockquote.lineNumber,
        "detail": "Blockquote spans " + lines + " line(s).",
        "context": blockquote.line.substr(0, 7)
      });
    });
  }
};

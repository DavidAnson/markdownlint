// @ts-check

"use strict";

const { filterTokens } = require("../../helpers");

/** @typedef {import("../../lib/markdownlint").MarkdownItToken} MarkdownItToken */
/** @typedef {(MarkdownItToken) => void} FilterTokensCallback */

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
    filterTokens(
      params,
      "blockquote_open",
      /** @type FilterTokensCallback */
      (blockquote) => {
        const lines = blockquote.map[1] - blockquote.map[0];
        onError({
          "lineNumber": blockquote.lineNumber,
          "detail": "Blockquote spans " + lines + " line(s).",
          "context": blockquote.line.substr(0, 7)
        });
      }
    );
  }
};

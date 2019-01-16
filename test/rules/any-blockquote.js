// @ts-check

"use strict";

const { URL } = require("url");

module.exports = {
  "names": [ "any-blockquote" ],
  "description": "Rule that reports an error for any blockquote",
  "information": new URL(
    "https://github.com/DavidAnson/markdownlint" +
    "/blob/master/test/rules/any-blockquote.js"
  ),
  "tags": [ "test" ],
  "function": function rule(params, onError) {
    params.tokens.filter(function filterToken(token) {
      return token.type === "blockquote_open";
    }).forEach(function forToken(blockquote) {
      const lines = blockquote.map[1] - blockquote.map[0];
      onError({
        "lineNumber": blockquote.lineNumber,
        "detail": "Blockquote spans " + lines + " line(s).",
        "context": blockquote.line.substr(0, 7)
      });
    });
  }
};

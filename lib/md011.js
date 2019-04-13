// @ts-check

"use strict";

const { addError, forEachInlineChild, rangeFromRegExp } = require("../helpers");

const reversedLinkRe = /\([^)]+\)\[[^\]^][^\]]*]/;

module.exports = {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "function": function MD011(params, onError) {
    forEachInlineChild(params, "text", function forToken(token) {
      const match = reversedLinkRe.exec(token.content);
      if (match) {
        addError(onError, token.lineNumber, match[0], null,
          rangeFromRegExp(token.line, reversedLinkRe));
      }
    });
  }
};

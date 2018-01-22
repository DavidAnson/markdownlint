// @ts-check

"use strict";

var shared = require("./shared");

var reversedLinkRe = /\([^)]+\)\[[^\]^][^\]]*]/;

module.exports = {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "function": function MD011(params, onError) {
    shared.forEachInlineChild(params, "text", function forToken(token) {
      var match = reversedLinkRe.exec(token.content);
      if (match) {
        shared.addError(onError, token.lineNumber, match[0], null,
          shared.rangeFromRegExp(token.line, reversedLinkRe));
      }
    });
  }
};

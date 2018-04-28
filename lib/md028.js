// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD028", "no-blanks-blockquote" ],
  "description": "Blank line inside blockquote",
  "tags": [ "blockquote", "whitespace" ],
  "function": function MD028(params, onError) {
    let prevToken = {};
    params.tokens.forEach(function forToken(token) {
      if ((token.type === "blockquote_open") &&
          (prevToken.type === "blockquote_close")) {
        shared.addError(onError, token.lineNumber - 1);
      }
      prevToken = token;
    });
  }
};

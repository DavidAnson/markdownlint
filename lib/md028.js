// @ts-check

"use strict";

const { addError } = require("../helpers");

module.exports = {
  "names": [ "MD028", "no-blanks-blockquote" ],
  "description": "Blank line inside blockquote",
  "tags": [ "blockquote", "whitespace" ],
  "function": function MD028(params, onError) {
    let prevToken = {};
    params.tokens.forEach(function forToken(token) {
      if ((token.type === "blockquote_open") &&
          (prevToken.type === "blockquote_close")) {
        addError(onError, token.lineNumber - 1);
      }
      prevToken = token;
    });
  }
};

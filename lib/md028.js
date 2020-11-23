// @ts-check

"use strict";

const { addError } = require("../helpers");

module.exports = {
  "names": [ "MD028", "no-blanks-blockquote" ],
  "description": "Blank line inside blockquote",
  "tags": [ "blockquote", "whitespace" ],
  "function": function MD028(params, onError) {
    let prevToken = {};
    let prevLineNumber = null;
    params.tokens.forEach(function forToken(token) {
      if ((token.type === "blockquote_open") &&
          (prevToken.type === "blockquote_close")) {
        for (
          let lineNumber = prevLineNumber;
          lineNumber < token.lineNumber;
          lineNumber++) {
          addError(onError, lineNumber);
        }
      }
      prevToken = token;
      if (token.type === "blockquote_open") {
        prevLineNumber = token.map[1] + 1;
      }
    });
  }
};

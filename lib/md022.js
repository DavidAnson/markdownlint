// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD022", "blanks-around-headers" ],
  "description": "Headers should be surrounded by blank lines",
  "tags": [ "headers", "blank_lines" ],
  "function": function MD022(params, onError) {
    var prevHeadingLineNumber = 0;
    var prevMaxLineIndex = -1;
    var needBlankLine = false;
    params.tokens.forEach(function forToken(token) {
      if (token.type === "heading_open") {
        if ((token.map[0] - prevMaxLineIndex) === 0) {
          shared.addErrorContext(onError, token.lineNumber,
            token.line.trim());
        }
      } else if (token.type === "heading_close") {
        needBlankLine = true;
      }
      if (token.map) {
        if (needBlankLine) {
          if ((token.map[0] - prevMaxLineIndex) === 0) {
            shared.addErrorContext(onError, prevHeadingLineNumber,
              params.lines[prevHeadingLineNumber - 1].trim());
          }
          needBlankLine = false;
        }
        prevMaxLineIndex = Math.max(prevMaxLineIndex, token.map[1]);
      }
      if (token.type === "heading_open") {
        prevHeadingLineNumber = token.lineNumber;
      }
    });
  }
};

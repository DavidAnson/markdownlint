// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD022", "blanks-around-headings", "blanks-around-headers" ],
  "description": "Headings should be surrounded by blank lines",
  "tags": [ "headings", "headers", "blank_lines" ],
  "function": function MD022(params, onError) {
    let prevHeadingLineNumber = 0;
    let prevMaxLineIndex = -1;
    let needBlankLine = false;
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

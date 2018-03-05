// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD031", "blanks-around-fences" ],
  "description": "Fenced code blocks should be surrounded by blank lines",
  "tags": [ "code", "blank_lines" ],
  "function": function MD031(params, onError) {
    var lines = params.lines;
    shared.forEachLine(function forLine(line, i, inCode, onFence) {
      if (((onFence > 0) && (i - 1 >= 0) && lines[i - 1].length) ||
          ((onFence < 0) && (i + 1 < lines.length) && lines[i + 1].length)) {
        shared.addErrorContext(onError, i + 1, lines[i].trim());
      }
    });
  }
};

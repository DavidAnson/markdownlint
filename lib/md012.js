// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD012", "no-multiple-blanks" ],
  "description": "Multiple consecutive blank lines",
  "tags": [ "whitespace", "blank_lines" ],
  "function": function MD012(params, onError) {
    var maximum = params.config.maximum || 1;
    var count = 0;
    shared.forEachLine(function forLine(line, lineIndex, inCode) {
      count = (inCode || line.trim().length) ? 0 : count + 1;
      if (maximum < count) {
        shared.addErrorDetailIf(onError, lineIndex + 1, maximum, count);
      }
    });
  }
};

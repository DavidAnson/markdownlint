// @ts-check

"use strict";

var shared = require("./shared");

var tabRe = /\t+/;

module.exports = {
  "names": [ "MD010", "no-hard-tabs" ],
  "description": "Hard tabs",
  "tags": [ "whitespace", "hard_tab" ],
  "function": function MD010(params, onError) {
    var codeBlocks = params.config.code_blocks;
    var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    shared.forEachLine(function forLine(line, lineIndex, inCode) {
      if (tabRe.test(line) && (!inCode || includeCodeBlocks)) {
        shared.addError(onError, lineIndex + 1,
          "Column: " + (line.indexOf("\t") + 1), null,
          shared.rangeFromRegExp(line, tabRe));
      }
    });
  }
};

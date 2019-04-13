// @ts-check

"use strict";

const { addError, forEachLine, rangeFromRegExp } = require("../helpers");
const { lineMetadata } = require("./cache");

const tabRe = /\t+/;

module.exports = {
  "names": [ "MD010", "no-hard-tabs" ],
  "description": "Hard tabs",
  "tags": [ "whitespace", "hard_tab" ],
  "function": function MD010(params, onError) {
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      if (tabRe.test(line) && (!inCode || includeCodeBlocks)) {
        addError(onError, lineIndex + 1, "Column: " + (line.indexOf("\t") + 1),
          null, rangeFromRegExp(line, tabRe));
      }
    });
  }
};

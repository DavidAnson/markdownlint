// @ts-check

"use strict";

const { addError, forEachLine } = require("../helpers");
const { lineMetadata } = require("./cache");

const tabRe = /\t+/g;

module.exports = {
  "names": [ "MD010", "no-hard-tabs" ],
  "description": "Hard tabs",
  "tags": [ "whitespace", "hard_tab" ],
  "function": function MD010(params, onError) {
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      if (!inCode || includeCodeBlocks) {
        let match = null;
        while ((match = tabRe.exec(line)) !== null) {
          const column = match.index + 1;
          const length = match[0].length;
          addError(
            onError,
            lineIndex + 1,
            "Column: " + column,
            null,
            [ column, length ],
            {
              "editColumn": column,
              "deleteCount": length,
              "insertText": "".padEnd(length)
            });
        }
      }
    });
  }
};

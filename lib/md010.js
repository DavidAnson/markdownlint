// @ts-check

"use strict";

const { addError, forEachLine, overlapsAnyRange } = require("../helpers");
const { codeBlockAndSpanRanges, lineMetadata } = require("./cache");

const tabRe = /\t+/g;

module.exports = {
  "names": [ "MD010", "no-hard-tabs" ],
  "description": "Hard tabs",
  "tags": [ "whitespace", "hard_tab" ],
  "function": function MD010(params, onError) {
    const codeBlocks = params.config.code_blocks;
    const includeCode = (codeBlocks === undefined) ? true : !!codeBlocks;
    const spacesPerTab = params.config.spaces_per_tab;
    const spaceMultiplier = (spacesPerTab === undefined) ?
      1 :
      Math.max(0, Number(spacesPerTab));
    const exclusions = includeCode ? [] : codeBlockAndSpanRanges();
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      if (includeCode || !inCode) {
        let match = null;
        while ((match = tabRe.exec(line)) !== null) {
          const { index } = match;
          const column = index + 1;
          const length = match[0].length;
          if (!overlapsAnyRange(exclusions, lineIndex, index, length)) {
            addError(
              onError,
              lineIndex + 1,
              "Column: " + column,
              null,
              [ column, length ],
              {
                "editColumn": column,
                "deleteCount": length,
                "insertText": "".padEnd(length * spaceMultiplier)
              }
            );
          }
        }
      }
    });
  }
};

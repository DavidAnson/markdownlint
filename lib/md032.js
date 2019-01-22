// @ts-check

"use strict";

const shared = require("./shared");

const blankLineRe = /^[\s>]*$/;

module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "function": function MD032(params, onError) {
    shared.flattenLists().filter((list) => !list.nesting).forEach((list) => {
      const firstLineIndex = list.open.map[0];
      if (!blankLineRe.test(params.lines[firstLineIndex - 1] || "")) {
        shared.addErrorContext(
          onError, firstLineIndex + 1, params.lines[firstLineIndex].trim());
      }
      const bottomLineIndex = list.lastLineIndex - 1;
      if (!blankLineRe.test(params.lines[bottomLineIndex + 1] || "")) {
        shared.addErrorContext(
          onError, bottomLineIndex + 1, params.lines[bottomLineIndex].trim());
      }
    });
  }
};

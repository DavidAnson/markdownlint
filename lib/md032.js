// @ts-check

"use strict";

const { addErrorContext, blockquotePrefixRe, isBlankLine } =
  require("../helpers");
const { flattenedLists } = require("./cache");

module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "function": function MD032(params, onError) {
    const { lines } = params;
    const filteredLists = flattenedLists().filter((list) => !list.nesting);
    for (const list of filteredLists) {
      const firstIndex = list.open.map[0];
      if (!isBlankLine(lines[firstIndex - 1])) {
        const line = lines[firstIndex];
        const quotePrefix = line.match(blockquotePrefixRe)[0].trimEnd();
        addErrorContext(
          onError,
          firstIndex + 1,
          line.trim(),
          null,
          null,
          null,
          {
            "insertText": `${quotePrefix}\n`
          });
      }
      const lastIndex = list.lastLineIndex - 1;
      if (!isBlankLine(lines[lastIndex + 1])) {
        const line = lines[lastIndex];
        const quotePrefix = line.match(blockquotePrefixRe)[0].trimEnd();
        addErrorContext(
          onError,
          lastIndex + 1,
          line.trim(),
          null,
          null,
          null,
          {
            "lineNumber": lastIndex + 2,
            "insertText": `${quotePrefix}\n`
          });
      }
    }
  }
};

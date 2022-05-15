// @ts-check

"use strict";

const { addErrorContext, forEachLine, isBlankLine } = require("../helpers");
const { lineMetadata } = require("./cache");

const codeFencePrefixRe = /^(.*?)[`~]/;

module.exports = {
  "names": [ "MD031", "blanks-around-fences" ],
  "description": "Fenced code blocks should be surrounded by blank lines",
  "tags": [ "code", "blank_lines" ],
  "function": function MD031(params, onError) {
    const listItems = params.config.list_items;
    const includeListItems = (listItems === undefined) ? true : !!listItems;
    const { lines } = params;
    forEachLine(lineMetadata(), (line, i, inCode, onFence, inTable, inItem) => {
      const onTopFence = (onFence > 0);
      const onBottomFence = (onFence < 0);
      if ((includeListItems || !inItem) &&
          ((onTopFence && !isBlankLine(lines[i - 1])) ||
           (onBottomFence && !isBlankLine(lines[i + 1])))) {
        const [ , prefix ] = line.match(codeFencePrefixRe) || [];
        const fixInfo = (prefix === undefined) ? null : {
          "lineNumber": i + (onTopFence ? 1 : 2),
          "insertText": `${prefix.replace(/[^>]/g, " ").trim()}\n`
        };
        addErrorContext(
          onError,
          i + 1,
          lines[i].trim(),
          null,
          null,
          null,
          fixInfo);
      }
    });
  }
};

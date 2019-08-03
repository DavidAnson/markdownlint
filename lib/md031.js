// @ts-check

"use strict";

const { addErrorContext, forEachLine, isBlankLine } = require("../helpers");
const { lineMetadata } = require("./cache");

module.exports = {
  "names": [ "MD031", "blanks-around-fences" ],
  "description": "Fenced code blocks should be surrounded by blank lines",
  "tags": [ "code", "blank_lines" ],
  "function": function MD031(params, onError) {
    const listItems = params.config.list_items;
    const includeListItems = (listItems === undefined) ? true : !!listItems;
    const { lines } = params;
    forEachLine(lineMetadata(), (line, i, inCode, onFence, inTable, inItem) => {
      if ((((onFence > 0) && !isBlankLine(lines[i - 1])) ||
           ((onFence < 0) && !isBlankLine(lines[i + 1]))) &&
          (includeListItems || !inItem)) {
        addErrorContext(onError, i + 1, lines[i].trim());
      }
    });
  }
};

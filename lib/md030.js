// @ts-check

"use strict";

const { addErrorDetailIf, listItemMarkerRe, rangeFromRegExp } =
  require("../helpers");
const { flattenedLists } = require("./cache");

module.exports = {
  "names": [ "MD030", "list-marker-space" ],
  "description": "Spaces after list markers",
  "tags": [ "ol", "ul", "whitespace" ],
  "function": function MD030(params, onError) {
    const ulSingle = params.config.ul_single || 1;
    const olSingle = params.config.ol_single || 1;
    const ulMulti = params.config.ul_multi || 1;
    const olMulti = params.config.ol_multi || 1;
    flattenedLists().forEach((list) => {
      const lineCount = list.lastLineIndex - list.open.map[0];
      const allSingle = lineCount === list.items.length;
      const expectedSpaces = list.unordered ?
        (allSingle ? ulSingle : ulMulti) :
        (allSingle ? olSingle : olMulti);
      list.items.forEach((item) => {
        const match = /^[\s>]*\S+(\s+)/.exec(item.line);
        addErrorDetailIf(onError, item.lineNumber,
          expectedSpaces, (match ? match[1].length : 0), null, null,
          rangeFromRegExp(item.line, listItemMarkerRe));
      });
    });
  }
};

// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD030", "list-marker-space" ],
  "description": "Spaces after list markers",
  "tags": [ "ol", "ul", "whitespace" ],
  "function": function MD030(params, onError) {
    const ulSingle = params.config.ul_single || 1;
    const olSingle = params.config.ol_single || 1;
    const ulMulti = params.config.ul_multi || 1;
    const olMulti = params.config.ol_multi || 1;
    shared.flattenLists().forEach(function forList(list) {
      const lineCount = list.lastLineIndex - list.open.map[0];
      const allSingle = lineCount === list.items.length;
      const expectedSpaces = list.unordered ?
        (allSingle ? ulSingle : ulMulti) :
        (allSingle ? olSingle : olMulti);
      list.items.forEach(function forItem(item) {
        const match = /^[\s>]*\S+(\s+)/.exec(item.line);
        shared.addErrorDetailIf(onError, item.lineNumber,
          expectedSpaces, (match ? match[1].length : 0), null,
          shared.rangeFromRegExp(item.line, shared.listItemMarkerRe));
      });
    });
  }
};

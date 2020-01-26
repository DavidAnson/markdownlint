// @ts-check

"use strict";

const { addErrorDetailIf } = require("../helpers");
const { flattenedLists } = require("./cache");

module.exports = {
  "names": [ "MD030", "list-marker-space" ],
  "description": "Spaces after list markers",
  "tags": [ "ol", "ul", "whitespace" ],
  "function": function MD030(params, onError) {
    const ulSingle = Number(params.config.ul_single || 1);
    const olSingle = Number(params.config.ol_single || 1);
    const ulMulti = Number(params.config.ul_multi || 1);
    const olMulti = Number(params.config.ol_multi || 1);
    flattenedLists().forEach((list) => {
      const lineCount = list.lastLineIndex - list.open.map[0];
      const allSingle = lineCount === list.items.length;
      const expectedSpaces = list.unordered ?
        (allSingle ? ulSingle : ulMulti) :
        (allSingle ? olSingle : olMulti);
      list.items.forEach((item) => {
        const { line, lineNumber } = item;
        const match = /^[\s>]*\S+(\s*)/.exec(line);
        const [ { "length": matchLength }, { "length": actualSpaces } ] = match;
        if (matchLength < line.length) {
          let fixInfo = null;
          if (expectedSpaces !== actualSpaces) {
            fixInfo = {
              "editColumn": matchLength - actualSpaces + 1,
              "deleteCount": actualSpaces,
              "insertText": "".padEnd(expectedSpaces)
            };
          }
          addErrorDetailIf(
            onError,
            lineNumber,
            expectedSpaces,
            actualSpaces,
            null,
            null,
            [ 1, matchLength ],
            fixInfo
          );
        }
      });
    });
  }
};

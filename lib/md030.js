// @ts-check

"use strict";

const { addErrorDetailIf } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD030", "list-marker-space" ],
  "description": "Spaces after list markers",
  "tags": [ "ol", "ul", "whitespace" ],
  "parser": "micromark",
  "function": function MD030(params, onError) {
    const ulSingle = Number(params.config.ul_single || 1);
    const olSingle = Number(params.config.ol_single || 1);
    const ulMulti = Number(params.config.ul_multi || 1);
    const olMulti = Number(params.config.ol_multi || 1);
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const lists = filterByTypes(micromarkTokens, [ "listOrdered", "listUnordered" ]);
    for (const list of lists) {
      const ordered = (list.type === "listOrdered");
      const listItemPrefixes =
        list.children.filter((token) => (token.type === "listItemPrefix"));
      const allSingleLine =
        (list.endLine - list.startLine + 1) === listItemPrefixes.length;
      const expectedSpaces = ordered ?
        (allSingleLine ? olSingle : olMulti) :
        (allSingleLine ? ulSingle : ulMulti);
      for (const listItemPrefix of listItemPrefixes) {
        const range = [
          listItemPrefix.startColumn,
          listItemPrefix.endColumn - listItemPrefix.startColumn
        ];
        const listItemPrefixWhitespaces = listItemPrefix.children.filter(
          (token) => (token.type === "listItemPrefixWhitespace")
        );
        for (const listItemPrefixWhitespace of listItemPrefixWhitespaces) {
          const { endColumn, startColumn, startLine } =
            listItemPrefixWhitespace;
          const actualSpaces = endColumn - startColumn;
          const fixInfo = {
            "editColumn": startColumn,
            "deleteCount": actualSpaces,
            "insertText": "".padEnd(expectedSpaces)
          };
          addErrorDetailIf(
            onError,
            startLine,
            expectedSpaces,
            actualSpaces,
            null,
            null,
            range,
            fixInfo
          );
        }
      }
    }
  }
};

// @ts-check

"use strict";

const { addErrorContextForLine, isBlankLine } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD058", "blanks-around-tables" ],
  "description": "Tables should be surrounded by blank lines",
  "tags": [ "table" ],
  "parser": "micromark",
  "function": function MD058(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const { lines } = params;
    // For every table...
    const tables = filterByTypes(micromarkTokens, [ "table" ]);
    for (const table of tables) {
      // Look for a blank line above the table
      const firstIndex = table.startLine - 1;
      if (!isBlankLine(lines[firstIndex - 1])) {
        addErrorContextForLine(
          onError,
          // @ts-ignore
          lines,
          firstIndex
        );
      }
      // Look for a blank line below the table
      const lastIndex = table.endLine - 1;
      if (!isBlankLine(lines[lastIndex + 1])) {
        addErrorContextForLine(
          onError,
          // @ts-ignore
          lines,
          lastIndex,
          lastIndex + 2
        );
      }
    }
  }
};

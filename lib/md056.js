// @ts-check

"use strict";

const { addErrorDetailIf } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

const makeRange = (start, end) => [ start, end - start + 1 ];

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD056", "table-column-count" ],
  "description": "Table column count",
  "tags": [ "table" ],
  "parser": "micromark",
  "function": function MD056(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const tables = filterByTypes(micromarkTokens, [ "table" ]);
    for (const table of tables) {
      const rows = filterByTypes(table.children, [ "tableDelimiterRow", "tableRow" ]);
      let expectedCount = 0;
      for (const row of rows) {
        const cells = filterByTypes(row.children, [ "tableData", "tableDelimiter", "tableHeader" ]);
        const actualCount = cells.length;
        expectedCount ||= actualCount;
        let detail = null;
        let range = null;
        if (actualCount < expectedCount) {
          detail = "Too few cells, row will be missing data";
          range = [ row.endColumn - 1, 1 ];
        } else if (expectedCount < actualCount) {
          detail = "Too many cells, extra data will be missing";
          range = makeRange(cells[expectedCount].startColumn, row.endColumn - 1);
        }
        addErrorDetailIf(
          onError,
          row.endLine,
          expectedCount,
          actualCount,
          detail,
          null,
          range
        );
      }
    }
  }
}

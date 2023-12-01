// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

module.exports = {
    "names": [ "MD055", "table-missing-border" ],
    "description": "Table is missing leading or trailing pipe character",
    "tags": [ "table" ],
    "function": function MD055(params, onError) {
        const tables = filterByTypes(params.parsers.micromark.tokens, [ "table" ]);
        for (const table of tables) {
            const rows = filterByTypes(table.children, [ "tableRow", "tableDelimiterRow" ]);
            for (const row of rows) {
                const { startLine, text } = row;
                if (!text.startsWith("|")) {
                    addErrorContext(onError, startLine, text, true);
                }
                if (!text.endsWith("|")) {
                    addErrorContext(onError, startLine, text, false, true);
                }
            }
        }
    }
}

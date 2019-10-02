// @ts-check

"use strict";

const { addErrorContext, filterTokens } = require("../helpers");

const dollarCommandRe = /^(\s*)(\$\s+)/;

function addErrorIfPreviousWasCommand(onError, previous) {
  if (previous) {
    const { lineNumber, lineTrim, column, length } = previous;
    addErrorContext(
      onError,
      lineNumber,
      lineTrim,
      null,
      null,
      [ column, length ],
      {
        "editColumn": column,
        "deleteCount": length
      }
    );
  }
}

module.exports = {
  "names": [ "MD014", "commands-show-output" ],
  "description": "Dollar signs used before commands without showing output",
  "tags": [ "code" ],
  "function": function MD014(params, onError) {
    [ "code_block", "fence" ].forEach((type) => {
      filterTokens(params, type, (token) => {
        let previous = null;
        const margin = (token.type === "fence") ? 1 : 0;
        for (let i = token.map[0] + margin; i < token.map[1] - margin; i++) {
          const line = params.lines[i];
          const lineTrim = line.trim();
          const match = dollarCommandRe.exec(line);
          if (!lineTrim || match) {
            addErrorIfPreviousWasCommand(onError, previous);
          }
          previous = match ? {
            "lineNumber": i + 1,
            "lineTrim": lineTrim,
            "column": match[1].length + 1,
            "length": match[2].length
          } : null;
        }
        addErrorIfPreviousWasCommand(onError, previous);
      });
    });
  }
};

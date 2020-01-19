// @ts-check

"use strict";

const { addErrorContext, filterTokens } = require("../helpers");

const dollarCommandRe = /^(\s*)(\$\s+)/;

module.exports = {
  "names": [ "MD014", "commands-show-output" ],
  "description": "Dollar signs used before commands without showing output",
  "tags": [ "code" ],
  "function": function MD014(params, onError) {
    [ "code_block", "fence" ].forEach((type) => {
      filterTokens(params, type, (token) => {
        const margin = (token.type === "fence") ? 1 : 0;
        const dollarInstances = [];
        let allDollars = true;
        for (let i = token.map[0] + margin; i < token.map[1] - margin; i++) {
          const line = params.lines[i];
          const lineTrim = line.trim();
          if (lineTrim) {
            const match = dollarCommandRe.exec(line);
            if (match) {
              const column = match[1].length + 1;
              const length = match[2].length;
              dollarInstances.push([ i, lineTrim, column, length ]);
            } else {
              allDollars = false;
            }
          }
        }
        if (allDollars) {
          dollarInstances.forEach((instance) => {
            const [ i, lineTrim, column, length ] = instance;
            addErrorContext(
              onError,
              i + 1,
              lineTrim,
              null,
              null,
              [ column, length ],
              {
                "editColumn": column,
                "deleteCount": length
              }
            );
          });
        }
      });
    });
  }
};

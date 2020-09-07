// @ts-check

"use strict";

const { addErrorDetailIf, forEachLine } = require("../helpers");
const { lineMetadata } = require("./cache");

module.exports = {
  "names": [ "MD012", "no-multiple-blanks" ],
  "description": "Multiple consecutive blank lines",
  "tags": [ "whitespace", "blank_lines" ],
  "function": function MD012(params, onError) {
    const maximum = Number(params.config.maximum || 1);
    let count = 0;
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      count = (inCode || (line.trim().length > 0)) ? 0 : count + 1;
      if (maximum < count) {
        addErrorDetailIf(
          onError,
          lineIndex + 1,
          maximum,
          count,
          null,
          null,
          null,
          {
            "deleteCount": -1
          });
      }
    });
  }
};

// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { getSiblingTokens } = require("../helpers/micromark.cjs");

module.exports = {
  "names": ["MD027", "no-multiple-space-blockquote"],
  "description": "Multiple spaces after blockquote symbol",
  "tags": ["blockquote", "whitespace", "indentation"],
  "function": function MD027(params, onError) {
    for (const siblings of getSiblingTokens(params.parsers.micromark.tokens)) {
      let previousType = null;
      for (const token of siblings) {
        const { type } = token;
        if ((type === "linePrefix") && (previousType === "blockQuotePrefix")) {
          const { endColumn, startColumn, startLine, text } = token;
          const line = params.lines[startLine - 1];
          addErrorContext(
            onError,
            startLine,
            line,
            null,
            null,
            [ 1, Math.min(endColumn, line.length) ],
            {
              "editColumn": startColumn,
              "deleteCount": text.length
            }
          );
        }
        previousType = type;
      }
    }
  }
};

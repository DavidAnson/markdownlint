// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": ["MD027", "no-multiple-space-blockquote"],
  "description": "Multiple spaces after blockquote symbol",
  "tags": ["blockquote", "whitespace", "indentation"],
  "function": function MD027(params, onError) {
    // eslint-disable-next-line dot-notation
    const { tokens } = params.parsers["micromark"];
    for (const token of filterByTypes(tokens, [ "linePrefix" ])) {
      const siblings = token.parent?.children || tokens;
      if (siblings[siblings.indexOf(token) - 1]?.type === "blockQuotePrefix") {
        const { startColumn, startLine, text } = token;
        const { length } = text;
        const line = params.lines[startLine - 1];
        addErrorContext(
          onError,
          startLine,
          line,
          null,
          null,
          [ startColumn, length ],
          {
            "editColumn": startColumn,
            "deleteCount": length
          }
        );
      }
    }
  }
};

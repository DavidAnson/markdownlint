// @ts-check

"use strict";

const { addError } = require("../helpers");
const { getSiblingTokens } = require("../helpers/micromark.cjs");

module.exports = {
  "names": [ "MD028", "no-blanks-blockquote" ],
  "description": "Blank line inside blockquote",
  "tags": [ "blockquote", "whitespace" ],
  "function": function MD028(params, onError) {
    for (const siblings of getSiblingTokens(params.parsers.micromark.tokens)) {
      let errorLineNumbers = null;
      for (const sibling of siblings) {
        switch (sibling.type) {
          case "blockQuote":
            for (const lineNumber of (errorLineNumbers || [])) {
              addError(onError, lineNumber);
            }
            errorLineNumbers = [];
            break;
          case "lineEnding":
          case "linePrefix":
          case "listItemIndent":
            // Ignore
            break;
          case "lineEndingBlank":
            if (errorLineNumbers) {
              errorLineNumbers.push(sibling.startLine);
            }
            break;
          default:
            errorLineNumbers = null;
            break;
        }
      }
    }
  }
};

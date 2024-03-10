// @ts-check

"use strict";

const { addError } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

const ignoreTypes = new Set([ "lineEnding", "listItemIndent", "linePrefix" ]);

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD028", "no-blanks-blockquote" ],
  "description": "Blank line inside blockquote",
  "tags": [ "blockquote", "whitespace" ],
  "parser": "micromark",
  "function": function MD028(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    for (const token of filterByTypes(micromarkTokens, [ "blockQuote" ])) {
      const errorLineNumbers = [];
      const siblings = token.parent?.children || micromarkTokens;
      for (let i = siblings.indexOf(token) + 1; i < siblings.length; i++) {
        const sibling = siblings[i];
        const { startLine, type } = sibling;
        if (type === "lineEndingBlank") {
          // Possible blank between blockquotes
          errorLineNumbers.push(startLine);
        } else if (ignoreTypes.has(type)) {
          // Ignore invisible formatting
        } else if (type === "blockQuote") {
          // Blockquote followed by blockquote
          for (const lineNumber of errorLineNumbers) {
            addError(onError, lineNumber);
          }
          break;
        } else {
          // Blockquote not followed by blockquote
          break;
        }
      }
    }
  }
};

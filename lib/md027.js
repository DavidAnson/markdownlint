// @ts-check

"use strict";

const { addErrorContext, newLineRe, rangeFromRegExp } = require("../helpers");

const spaceAfterBlockQuote = /^\s*(?:>\s+)+\S/;

module.exports = {
  "names": [ "MD027", "no-multiple-space-blockquote" ],
  "description": "Multiple spaces after blockquote symbol",
  "tags": [ "blockquote", "whitespace", "indentation" ],
  "function": function MD027(params, onError) {
    let blockquoteNesting = 0;
    let listItemNesting = 0;
    params.tokens.forEach(function forToken(token) {
      if (token.type === "blockquote_open") {
        blockquoteNesting++;
      } else if (token.type === "blockquote_close") {
        blockquoteNesting--;
      } else if (token.type === "list_item_open") {
        listItemNesting++;
      } else if (token.type === "list_item_close") {
        listItemNesting--;
      } else if ((token.type === "inline") && (blockquoteNesting > 0)) {
        const multipleSpaces = listItemNesting ?
          /^(\s*>)+\s\s+>/.test(token.line) :
          /^(\s*>)+\s\s/.test(token.line);
        if (multipleSpaces) {
          addErrorContext(onError, token.lineNumber, token.line, null,
            null, rangeFromRegExp(token.line, spaceAfterBlockQuote));
        }
        token.content.split(newLineRe)
          .forEach(function forLine(line, offset) {
            if (/^\s/.test(line)) {
              addErrorContext(onError, token.lineNumber + offset,
                "> " + line, null, null,
                rangeFromRegExp(line, spaceAfterBlockQuote));
            }
          });
      }
    });
  }
};

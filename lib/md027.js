// @ts-check

"use strict";

const { addErrorContext, newLineRe } = require("../helpers");

const spaceAfterBlockQuoteRe = /^((?:\s*>)+)(\s{2,})\S/;

module.exports = {
  "names": [ "MD027", "no-multiple-space-blockquote" ],
  "description": "Multiple spaces after blockquote symbol",
  "tags": [ "blockquote", "whitespace", "indentation" ],
  "function": function MD027(params, onError) {
    let blockquoteNesting = 0;
    let listItemNesting = 0;
    for (const token of params.tokens) {
      const { content, lineNumber, type } = token;
      if (type === "blockquote_open") {
        blockquoteNesting++;
      } else if (type === "blockquote_close") {
        blockquoteNesting--;
      } else if (type === "list_item_open") {
        listItemNesting++;
      } else if (type === "list_item_close") {
        listItemNesting--;
      } else if ((type === "inline") && blockquoteNesting) {
        const lineCount = content.split(newLineRe).length;
        for (let i = 0; i < lineCount; i++) {
          const line = params.lines[lineNumber + i - 1];
          const match = line.match(spaceAfterBlockQuoteRe);
          if (match) {
            const [
              fullMatch,
              { "length": blockquoteLength },
              { "length": spaceLength }
            ] = match;
            if (!listItemNesting || (fullMatch[fullMatch.length - 1] === ">")) {
              addErrorContext(
                onError,
                lineNumber + i,
                line,
                null,
                null,
                [ 1, fullMatch.length ],
                {
                  "editColumn": blockquoteLength + 1,
                  "deleteCount": spaceLength - 1
                }
              );
            }
          }
        }
      }
    }
  }
};

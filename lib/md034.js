// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByPredicate, getHtmlTagInfo } =
  require("../helpers/micromark.cjs");

module.exports = {
  "names": [ "MD034", "no-bare-urls" ],
  "description": "Bare URL used",
  "tags": [ "links", "url" ],
  "function": function MD034(params, onError) {
    const literalAutolinks =
      filterByPredicate(
        params.parsers.micromark.tokens,
        (token) => token.type === "literalAutolink",
        (tokens) => {
          const result = [];
          for (let i = 0; i < tokens.length; i++) {
            const openToken = tokens[i];
            const openTagInfo = getHtmlTagInfo(openToken);
            if (openTagInfo && !openTagInfo.close) {
              let count = 1;
              for (let j = i + 1; j < tokens.length; j++) {
                const closeToken = tokens[j];
                const closeTagInfo = getHtmlTagInfo(closeToken);
                if (closeTagInfo && (openTagInfo.name === closeTagInfo.name)) {
                  if (closeTagInfo.close) {
                    count--;
                    if (count === 0) {
                      i = j;
                      break;
                    }
                  } else {
                    count++;
                  }
                }
              }
            } else {
              result.push(openToken);
            }
          }
          return result;
        });
    for (const token of literalAutolinks) {
      const range = [
        token.startColumn,
        token.endColumn - token.startColumn
      ];
      const fixInfo = {
        "editColumn": range[0],
        "deleteCount": range[1],
        "insertText": `<${token.text}>`
      };
      addErrorContext(
        onError,
        token.startLine,
        token.text,
        null,
        null,
        range,
        fixInfo
      );
    }
  }
};

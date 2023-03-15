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
        (token) => {
          const { children } = token;
          const result = [];
          for (let i = 0; i < children.length; i++) {
            const openToken = children[i];
            const openTagInfo = getHtmlTagInfo(openToken);
            if (openTagInfo && !openTagInfo.close) {
              let count = 1;
              for (let j = i + 1; j < children.length; j++) {
                const closeToken = children[j];
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

// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByPredicate, filterByTypes, getHtmlTagInfo, inHtmlFlow, parse } =
  require("../helpers/micromark.cjs");

module.exports = {
  "names": [ "MD034", "no-bare-urls" ],
  "description": "Bare URL used",
  "tags": [ "links", "url" ],
  "function": function MD034(params, onError) {
    const literalAutolinks = (tokens) => (
      filterByPredicate(
        tokens,
        (token) => (token.type === "literalAutolink") && !inHtmlFlow(token),
        (token) => {
          const { children } = token;
          const result = [];
          for (let i = 0; i < children.length; i++) {
            const current = children[i];
            const openTagInfo = getHtmlTagInfo(current);
            if (openTagInfo && !openTagInfo.close) {
              let count = 1;
              for (let j = i + 1; j < children.length; j++) {
                const candidate = children[j];
                const closeTagInfo = getHtmlTagInfo(candidate);
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
              result.push(current);
            }
          }
          return result;
        }
      )
    );
    const autoLinks = filterByTypes(
      params.parsers.micromark.tokens,
      [ "literalAutolink" ]
    );
    if (autoLinks.length > 0) {
      // Re-parse with correct link/image reference definition handling
      const document = params.lines.join("\n");
      const tokens = parse(document, undefined, false);
      for (const token of literalAutolinks(tokens)) {
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
  }
};

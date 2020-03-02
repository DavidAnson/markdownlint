// @ts-check

"use strict";

const { addErrorContext, filterTokens } = require("../helpers");

const spaceInLinkRe = /\[|^(?:\s+(?:[^\]]*?)\s*|(?:[^\]]*?)\s+)](?=\(\S*\))/;

module.exports = {
  "names": [ "MD039", "no-space-in-links" ],
  "description": "Spaces inside link text",
  "tags": [ "whitespace", "links" ],
  "function": function MD039(params, onError) {
    filterTokens(params, "inline", (token) => {
      const { children } = token;
      let { lineNumber } = token;
      let inLink = false;
      let linkText = "";
      let lineIndex = 0;
      children.forEach((child) => {
        const { content, type } = child;
        if (type === "link_open") {
          inLink = true;
          linkText = "";
        } else if (type === "link_close") {
          inLink = false;
          const left = linkText.trimLeft().length !== linkText.length;
          const right = linkText.trimRight().length !== linkText.length;
          if (left || right) {
            const line = params.lines[lineNumber - 1];
            const match = line.slice(lineIndex).match(spaceInLinkRe);
            const column = match.index + lineIndex + 1;
            const length = match[0].length;
            lineIndex = column + length - 1;
            addErrorContext(
              onError,
              lineNumber,
              `[${linkText}]`,
              left,
              right,
              [ column, length ],
              {
                "editColumn": column + 1,
                "deleteCount": length - 2,
                "insertText": linkText.trim()
              }
            );
          }
        } else if ((type === "softbreak") || (type === "hardbreak")) {
          lineNumber++;
          lineIndex = 0;
        } else if (inLink) {
          linkText += content;
        }
      });
    });
  }
};

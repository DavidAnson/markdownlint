// @ts-check

"use strict";

const { addErrorContext, filterTokens } = require("../helpers");

const spaceInLinkRe = /\[(?:\s+(?:[^\]]*?)\s*|(?:[^\]]*?)\s+)](?=\(\S*\))/;

module.exports = {
  "names": [ "MD039", "no-space-in-links" ],
  "description": "Spaces inside link text",
  "tags": [ "whitespace", "links" ],
  "function": function MD039(params, onError) {
    filterTokens(params, "inline", (token) => {
      const { line, lineNumber, children } = token;
      let inLink = false;
      let linkText = "";
      children.forEach((child) => {
        if (child.type === "link_open") {
          inLink = true;
          linkText = "";
        } else if (child.type === "link_close") {
          inLink = false;
          const left = linkText.trimLeft().length !== linkText.length;
          const right = linkText.trimRight().length !== linkText.length;
          if (left || right) {
            const match = line.match(spaceInLinkRe);
            const column = match.index + 1;
            const length = match[0].length;
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
        } else if (inLink) {
          linkText += child.content;
        }
      });
    });
  }
};

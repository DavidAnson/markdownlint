// @ts-check

"use strict";

const { addErrorContext, filterTokens, rangeFromRegExp, trimLeft, trimRight } =
  require("../helpers");

const spaceInLinkRe = /\[(?:\s+(?:[^\]]*?)\s*|(?:[^\]]*?)\s+)](?=\(\S*\))/;

module.exports = {
  "names": [ "MD039", "no-space-in-links" ],
  "description": "Spaces inside link text",
  "tags": [ "whitespace", "links" ],
  "function": function MD039(params, onError) {
    filterTokens(params, "inline", function forToken(token) {
      let inLink = false;
      let linkText = "";
      token.children.forEach(function forChild(child) {
        if (child.type === "link_open") {
          inLink = true;
          linkText = "";
        } else if (child.type === "link_close") {
          inLink = false;
          const left = trimLeft(linkText).length !== linkText.length;
          const right = trimRight(linkText).length !== linkText.length;
          if (left || right) {
            addErrorContext(onError, token.lineNumber,
              "[" + linkText + "]", left, right,
              rangeFromRegExp(token.line, spaceInLinkRe));
          }
        } else if (inLink) {
          linkText += child.content;
        }
      });
    });
  }
};

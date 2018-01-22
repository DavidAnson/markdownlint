// @ts-check

"use strict";

var shared = require("./shared");

var spaceInLinkRe = /\[(?:\s+(?:[^\]]*?)\s*|(?:[^\]]*?)\s+)](?=\(\S*\))/;

module.exports = {
  "names": [ "MD039", "no-space-in-links" ],
  "description": "Spaces inside link text",
  "tags": [ "whitespace", "links" ],
  "function": function MD039(params, onError) {
    shared.filterTokens(params, "inline", function forToken(token) {
      var inLink = false;
      var linkText = "";
      token.children.forEach(function forChild(child) {
        if (child.type === "link_open") {
          inLink = true;
          linkText = "";
        } else if (child.type === "link_close") {
          inLink = false;
          var left = shared.trimLeft(linkText).length !== linkText.length;
          var right = shared.trimRight(linkText).length !== linkText.length;
          if (left || right) {
            shared.addErrorContext(onError, token.lineNumber,
              "[" + linkText + "]", left, right,
              shared.rangeFromRegExp(token.line, spaceInLinkRe));
          }
        } else if (inLink) {
          linkText += child.content;
        }
      });
    });
  }
};

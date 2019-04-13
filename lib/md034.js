// @ts-check

"use strict";

const { addErrorContext, bareUrlRe, filterTokens, rangeFromRegExp } =
  require("../helpers");

module.exports = {
  "names": [ "MD034", "no-bare-urls" ],
  "description": "Bare URL used",
  "tags": [ "links", "url" ],
  "function": function MD034(params, onError) {
    filterTokens(params, "inline", function forToken(token) {
      let inLink = false;
      token.children.forEach(function forChild(child) {
        let match = null;
        if (child.type === "link_open") {
          inLink = true;
        } else if (child.type === "link_close") {
          inLink = false;
        } else if ((child.type === "text") &&
                    !inLink &&
                    (match = bareUrlRe.exec(child.content))) {
          addErrorContext(onError, child.lineNumber, match[0], null,
            null, rangeFromRegExp(child.line, bareUrlRe));
        }
      });
    });
  }
};

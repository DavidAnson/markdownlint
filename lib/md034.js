// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD034", "no-bare-urls" ],
  "description": "Bare URL used",
  "tags": [ "links", "url" ],
  "function": function MD034(params, onError) {
    shared.filterTokens(params, "inline", function forToken(token) {
      var inLink = false;
      token.children.forEach(function forChild(child) {
        var match = null;
        if (child.type === "link_open") {
          inLink = true;
        } else if (child.type === "link_close") {
          inLink = false;
        } else if ((child.type === "text") &&
                    !inLink &&
                    (match = shared.bareUrlRe.exec(child.content))) {
          shared.addErrorContext(onError, child.lineNumber, match[0], null,
            null, shared.rangeFromRegExp(child.line, shared.bareUrlRe));
        }
      });
    });
  }
};

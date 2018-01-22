// @ts-check

"use strict";

var shared = require("./shared");

var emptyLinkRe = /\[[^\]]*](?:\((?:#?|(?:<>))\))/;

module.exports = {
  "names": [ "MD042", "no-empty-links" ],
  "description": "No empty links",
  "tags": [ "links" ],
  "function": function MD042(params, onError) {
    shared.filterTokens(params, "inline", function forToken(token) {
      var inLink = false;
      var linkText = "";
      var emptyLink = false;
      token.children.forEach(function forChild(child) {
        if (child.type === "link_open") {
          inLink = true;
          linkText = "";
          child.attrs.forEach(function forAttr(attr) {
            if (attr[0] === "href" && (!attr[1] || (attr[1] === "#"))) {
              emptyLink = true;
            }
          });
        } else if (child.type === "link_close") {
          inLink = false;
          if (emptyLink) {
            shared.addErrorContext(onError, child.lineNumber,
              "[" + linkText + "]()", null, null,
              shared.rangeFromRegExp(child.line, emptyLinkRe));
          }
        } else if (inLink) {
          linkText += child.content;
        }
      });
    });
  }
};

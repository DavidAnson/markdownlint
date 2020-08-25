// @ts-check

"use strict";

const { addErrorContext, filterTokens, rangeFromRegExp } =
  require("../helpers");

const emptyLinkRe = /\[[^\]]*](?:\((?:#?|(?:<>))\))/;

module.exports = {
  "names": [ "MD042", "no-empty-links" ],
  "description": "No empty links",
  "tags": [ "links" ],
  "function": function MD042(params, onError) {
    filterTokens(params, "inline", function forToken(token) {
      let inLink = false;
      let linkText = "";
      let emptyLink = false;
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
            addErrorContext(onError, child.lineNumber,
              "[" + linkText + "]()", null, null,
              rangeFromRegExp(child.line, emptyLinkRe));
            emptyLink = false;
          }
        } else if (inLink) {
          linkText += child.content;
        }
      });
    });
  }
};

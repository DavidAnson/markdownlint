// @ts-check

"use strict";

const { addErrorContext, escapeForRegExp, filterTokens } =
  require("../helpers");

module.exports = {
  "names": [ "MD042", "no-empty-links" ],
  "description": "No empty links",
  "tags": [ "links" ],
  "function": function MD042(params, onError) {
    filterTokens(params, "inline", function forToken(token) {
      let inLink = false;
      let linkText = "";
      let emptyLink = false;
      for (const child of token.children) {
        if (child.type === "link_open") {
          inLink = true;
          linkText = "";
          for (const attr of child.attrs) {
            if (attr[0] === "href" && (!attr[1] || (attr[1] === "#"))) {
              emptyLink = true;
            }
          }
        } else if (child.type === "link_close") {
          inLink = false;
          if (emptyLink) {
            let context = `[${linkText}]`;
            let range = null;
            const match = child.line.match(
              new RegExp(`${escapeForRegExp(context)}\\((?:|#|<>)\\)`)
            );
            if (match) {
              context = match[0];
              range = [ match.index + 1, match[0].length ];
            }
            addErrorContext(
              onError, child.lineNumber, context, null, null, range
            );
            emptyLink = false;
          }
        } else if (inLink) {
          linkText += child.content;
        }
      }
    });
  }
};

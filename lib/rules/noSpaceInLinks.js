var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD039",
  "desc": "Spaces inside link text",
  "tags": [ "whitespace", "links" ],
  "aliases": [ "no-space-in-links" ],
  "regexp": expressions.spaceInsideLinkRe,
  "func": function MD039(params, errors) {
    shared.filterTokens(params, "inline", function forToken(token) {
      var inLink = false;
      var linkText = "";
      token.children.forEach(function forChild(child) {
        if (child.type === "link_open") {
          inLink = true;
          linkText = "";
        } else if (child.type === "link_close") {
          inLink = false;
          var left = linkText.trimLeft().length !== linkText.length;
          var right = linkText.trimRight().length !== linkText.length;
          if (left || right) {
            errors.addContext(
              token.lineNumber, "[" + linkText + "]", left, right);
          }
        } else if (inLink) {
          linkText += child.content;
        }
      });
    });
  }
};

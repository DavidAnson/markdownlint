var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD042",
  "desc": "No empty links",
  "tags": [ "links" ],
  "aliases": [ "no-empty-links" ],
  "regexp": expressions.emptyLinkRe,
  "func": function MD042(params, errors) {
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
            errors.addContext(child.lineNumber, "[" + linkText + "]");
          }
        } else if (inLink) {
          linkText += child.content;
        }
      });
    });
  }
};

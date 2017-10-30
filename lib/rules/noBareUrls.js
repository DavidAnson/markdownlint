var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD034",
  "desc": "Bare URL used",
  "tags": [ "links", "url" ],
  "aliases": [ "no-bare-urls" ],
  "regexp": expressions.bareUrlRe,
  "func": function MD034(params, errors) {
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
                    (match = expressions.bareUrlRe.exec(child.content))) {
          errors.addContext(child.lineNumber, match[0]);
        }
      });
    });
  }
};

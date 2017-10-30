var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD023",
  "desc": "Headers must start at the beginning of the line",
  "tags": [ "headers", "spaces" ],
  "aliases": [ "header-start-left" ],
  "regexp": expressions.spaceBeforeHeaderRe,
  "func": function MD023(params, errors) {
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if (expressions.spaceBeforeHeaderRe.test(token.line)) {
        errors.addContext(token.lineNumber, token.line);
      }
    });
  }
};

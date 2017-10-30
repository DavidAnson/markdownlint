var expressions = require("../expressions");
var shared = require("../shared");

module.exports = {
  "name": "MD019",
  "desc": "Multiple spaces after hash on atx style header",
  "tags": [ "headers", "atx", "spaces" ],
  "aliases": [ "no-multiple-space-atx" ],
  "regexp": expressions.atxHeaderSpaceRe,
  "func": function MD019(params, errors) {
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if ((shared.headingStyleFor(token) === "atx") &&
          /^#+\s\s/.test(token.line)) {
        errors.addContext(token.lineNumber, token.line.trim());
      }
    });
  }
};

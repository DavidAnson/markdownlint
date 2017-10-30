var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD021",
  "desc": "Multiple spaces inside hashes on closed atx style header",
  "tags": [ "headers", "atx_closed", "spaces" ],
  "aliases": [ "no-multiple-space-closed-atx" ],
  "regexp": expressions.atxClosedHeaderSpaceRe,
  "func": function MD021(params, errors) {
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if (shared.headingStyleFor(token) === "atx_closed") {
        var left = /^#+\s\s/.test(token.line);
        var right = /\s\s#+$/.test(token.line);
        if (left || right) {
          errors.addContext(token.lineNumber, token.line.trim(), left, right);
        }
      }
    });
  }
};

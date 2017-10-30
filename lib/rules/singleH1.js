var shared = require("../shared");

module.exports = {
  "name": "MD025",
  "desc": "Multiple top level headers in the same document",
  "tags": [ "headers" ],
  "aliases": [ "single-h1" ],
  "regexp": null,
  "func": function MD025(params, errors) {
    var level = params.options.level || 1;
    var tag = "h" + level;
    var hasTopLevelHeading = false;
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if (token.tag === tag) {
        if (hasTopLevelHeading) {
          errors.addContext(token.lineNumber, token.line.trim());
        } else if (token.lineNumber === 1) {
          hasTopLevelHeading = true;
        }
      }
    });
  }
};

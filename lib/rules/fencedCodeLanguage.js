var shared = require("../shared");

module.exports = {
  "name": "MD040",
  "desc": "Fenced code blocks should have a language specified",
  "tags": [ "code", "language" ],
  "aliases": [ "fenced-code-language" ],
  "regexp": null,
  "func": function MD040(params, errors) {
    shared.filterTokens(params, "fence", function forToken(token) {
      if (!token.info.trim()) {
        errors.addContext(token.lineNumber, token.line);
      }
    });
  }
};

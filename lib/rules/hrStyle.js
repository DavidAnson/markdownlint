var shared = require("../shared");

module.exports = {
  "name": "MD035",
  "desc": "Horizontal rule style",
  "tags": [ "hr" ],
  "aliases": [ "hr-style" ],
  "regexp": null,
  "func": function MD035(params, errors) {
    var style = params.options.style || "consistent";
    shared.filterTokens(params, "hr", function forToken(token) {
      var lineTrim = token.line.trim();
      if (style === "consistent") {
        style = lineTrim;
      }
      errors.addDetailIf(token.lineNumber, style, lineTrim);
    });
  }
};

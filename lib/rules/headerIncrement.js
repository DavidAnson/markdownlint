var shared = require("../shared");

module.exports = {
"name": "MD001",
"desc": "Header levels should only increment by one level at a time",
"tags": [ "headers" ],
"aliases": [ "header-increment" ],
"regexp": null,
"func": function MD001(params, errors) {
  var prevLevel = 0;
  shared.filterTokens(params, "heading_open", function forToken(token) {
    var level = parseInt(token.tag.slice(1), 10);
    if (prevLevel && (level > prevLevel)) {
      errors.addDetailIf(token.lineNumber,
        "h" + (prevLevel + 1), "h" + level);
      }
      prevLevel = level;
    });
  }
};

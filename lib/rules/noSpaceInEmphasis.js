var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD037",
  "desc": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "aliases": [ "no-space-in-emphasis" ],
  "regexp": expressions.spaceInsideEmphasisRe,
  "func": function MD037(params, errors) {
    shared.forEachInlineChild(params, "text", function forToken(token) {
      var left = /\s(\*\*?|__?)\s.+\1/.exec(token.content);
      var right = /(\*\*?|__?).+\s\1\s/.exec(token.content);
      if (left) {
        errors.addContext(token.lineNumber, left[0].trim());
      } else if (right) {
        errors.addContext(token.lineNumber, right[0].trim(), false, true);
      }
    });
  }
};

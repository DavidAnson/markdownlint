var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD011",
  "desc": "Reversed link syntax",
  "tags": [ "links" ],
  "aliases": [ "no-reversed-links" ],
  "regexp": expressions.reversedLinkRe,
  "func": function MD011(params, errors) {
    shared.forEachInlineChild(params, "text", function forToken(token) {
      var match = expressions.reversedLinkRe.exec(token.content);
      if (match) {
        errors.addDetail(token.lineNumber, match[0]);
      }
    });
  }
};

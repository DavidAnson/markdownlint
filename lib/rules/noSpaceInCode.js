var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD038",
  "desc": "Spaces inside code span elements",
  "tags": [ "whitespace", "code" ],
  "aliases": [ "no-space-in-code" ],
  "regexp": expressions.spaceInsideCodeRe,
  "func": function MD038(params, errors) {
    var inlineCodeSpansRe = /(?:^|[^\\])((`+)((?:.*?[^`])|)\2(?!`))/g;
    shared.forEachInlineChild(params, "code_inline",
      function forToken(token) {
        var line = params.lines[token.lineNumber - 1];
        var match = null;
        while ((match = inlineCodeSpansRe.exec(line)) !== null) {
          var inlineCodeSpan = match[1];
          var content = match[3];
          if (/^\s([^`]|$)/.test(content)) {
            errors.addContext(token.lineNumber, inlineCodeSpan);
          } else if (/[^`]\s$/.test(content)) {
            errors.addContext(token.lineNumber, inlineCodeSpan, false, true);
          }
        }
      });
  }
};

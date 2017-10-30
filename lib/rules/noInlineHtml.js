var expressions = require("../expressions");
var shared = require("../shared");

module.exports = {
  "name": "MD033",
  "desc": "Inline HTML",
  "tags": [ "html" ],
  "aliases": [ "no-inline-html" ],
  "regexp": expressions.htmlRe,
  "func": function MD033(params, errors) {
    var allowedElements = (params.options.allowed_elements || [])
      .map(function forElement(element) {
        return element.toLowerCase();
      });
    function forToken(token) {
      token.content.split(shared.newLineRe)
        .forEach(function forLine(line, offset) {
          var allowed = (line.match(/<[^/\s>!]*/g) || [])
            .filter(function forElement(element) {
              return element.length > 1;
            })
            .map(function forElement(element) {
              return element.slice(1).toLowerCase();
            })
            .filter(function forElement(element) {
              return allowedElements.indexOf(element) === -1;
            });
          if (allowed.length) {
            errors.addDetail(token.lineNumber + offset,
              "Element: " + allowed[0]);
          }
        });
    }
    shared.filterTokens(params, "html_block", forToken);
    shared.forEachInlineChild(params, "html_inline", forToken);
  }
};

var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD027",
  "desc": "Multiple spaces after blockquote symbol",
  "tags": [ "blockquote", "whitespace", "indentation" ],
  "aliases": [ "no-multiple-space-blockquote" ],
  "regexp": expressions.spaceAfterBlockQuote,
  "func": function MD027(params, errors) {
    var blockquoteNesting = 0;
    var listItemNesting = 0;
    params.tokens.forEach(function forToken(token) {
      if (token.type === "blockquote_open") {
        blockquoteNesting++;
      } else if (token.type === "blockquote_close") {
        blockquoteNesting--;
      } else if (token.type === "list_item_open") {
        listItemNesting++;
      } else if (token.type === "list_item_close") {
        listItemNesting--;
      } else if ((token.type === "inline") && (blockquoteNesting > 0)) {
        var multipleSpaces = listItemNesting ?
          /^(\s*>)+\s\s+>/.test(token.line) :
          /^(\s*>)+\s\s/.test(token.line);
        if (multipleSpaces) {
          errors.addContext(token.lineNumber, token.line);
        }
        token.content.split(shared.newLineRe)
          .forEach(function forLine(line, offset) {
            if (/^\s/.test(line)) {
              errors.addContext(token.lineNumber + offset, "> " + line);
            }
          });
      }
    });
  }
};

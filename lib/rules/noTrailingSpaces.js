var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD009",
  "desc": "Trailing spaces",
  "tags": [ "whitespace" ],
  "aliases": [ "no-trailing-spaces" ],
  "regexp": expressions.trailingSpaceRe,
  "func": function MD009(params, errors) {
    var brSpaces = params.options.br_spaces || 0;
    var listItemEmptyLines = params.options.list_item_empty_lines;
    var allowListItemEmptyLines =
      (listItemEmptyLines === undefined) ? false : !!listItemEmptyLines;
    var listItemLineNumbers = [];
    if (allowListItemEmptyLines) {
      shared.filterTokens(params, "list_item_open", function forToken(token) {
        for (var i = token.map[0]; i < token.map[1]; i++) {
          listItemLineNumbers.push(i + 1);
        }
      });
    }
    shared.forEachLine(params, function forLine(line, lineIndex) {
      var lineNumber = lineIndex + 1;
      if (expressions.trailingSpaceRe.test(line) &&
        (listItemLineNumbers.indexOf(lineNumber) === -1)) {
        var expected = (brSpaces < 2) ? 0 : brSpaces;
        errors.addDetailIf(lineNumber,
          expected, line.length - line.trimRight().length);
      }
    });
  }
};

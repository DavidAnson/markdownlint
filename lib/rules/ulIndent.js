var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD007",
  "desc": "Unordered list indentation",
  "tags": [ "bullet", "ul", "indentation" ],
  "aliases": [ "ul-indent" ],
  "regexp": expressions.listItemMarkerRe,
  "func": function MD007(params, errors) {
    var optionsIndent = params.options.indent || 2;
    var prevIndent = 0;
    shared.flattenLists(params).forEach(function forList(list) {
      if (list.unordered && list.parentsUnordered) {
        var indent = shared.indentFor(list.open);
        if (indent > prevIndent) {
          errors.addDetailIf(list.open.lineNumber,
            prevIndent + optionsIndent, indent);
        }
        prevIndent = indent;
      }
    });
  }
};

var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD006",
  "desc": "Consider starting bulleted lists at the beginning of the line",
  "tags": [ "bullet", "ul", "indentation" ],
  "aliases": [ "ul-start-left" ],
  "regexp": expressions.listItemMarkerRe,
  "func": function MD006(params, errors) {
    shared.flattenLists(params).forEach(function forList(list) {
      if (list.unordered && !list.nesting) {
        errors.addDetailIf(list.open.lineNumber, 0, shared.indentFor(list.open));
      }
    });
  }
};

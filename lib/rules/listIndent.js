var expressions = require("../expressions");
var shared = require("../shared");

module.exports = {
  "name": "MD005",
  "desc": "Inconsistent indentation for list items at the same level",
  "tags": [ "bullet", "ul", "indentation" ],
  "aliases": [ "list-indent" ],
  "regexp": expressions.listItemMarkerRe,
  "func": function MD005(params, errors) {
    shared.flattenLists(params).forEach(function forList(list) {
      var indent = shared.indentFor(list.items[0]);
      list.items.forEach(function forItem(item) {
        errors.addDetailIf(item.lineNumber, indent, shared.indentFor(item));
      });
    });
  }
};

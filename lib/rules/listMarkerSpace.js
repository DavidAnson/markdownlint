var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD030",
  "desc": "Spaces after list markers",
  "tags": [ "ol", "ul", "whitespace" ],
  "aliases": [ "list-marker-space" ],
  "regexp": expressions.listItemMarkerRe,
  "func": function MD030(params, errors) {
    var ulSingle = params.options.ul_single || 1;
    var olSingle = params.options.ol_single || 1;
    var ulMulti = params.options.ul_multi || 1;
    var olMulti = params.options.ol_multi || 1;
    shared.flattenLists(params).forEach(function forList(list) {
      var lineCount = list.lastLineIndex - list.open.map[0];
      var allSingle = lineCount === list.items.length;
      var expectedSpaces = list.unordered ?
        (allSingle ? ulSingle : ulMulti) :
        (allSingle ? olSingle : olMulti);
      list.items.forEach(function forItem(item) {
        var match = /^[\s>]*\S+(\s+)/.exec(item.line);
        errors.addDetailIf(item.lineNumber,
          expectedSpaces, (match ? match[1].length : 0));
      });
    });
  }
};

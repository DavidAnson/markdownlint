var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD029",
  "desc": "Ordered list item prefix",
  "tags": [ "ol" ],
  "aliases": [ "ol-prefix" ],
  "regexp": expressions.listItemMarkerRe,
  "func": function MD029(params, errors) {
    var style = params.options.style || "one";
    shared.flattenLists(params).forEach(function forList(list) {
      if (!list.unordered) {
        var number = 1;
        list.items.forEach(function forItem(item) {
          var match = /^[\s>]*([^.)]*)[.)]/.exec(item.line);
          errors.addDetailIf(item.lineNumber,
            String(number), !match || match[1]);
          if (style === "ordered") {
            number++;
          }
        });
      }
    });
  }
};

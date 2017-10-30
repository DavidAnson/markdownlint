var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD004",
  "desc": "Unordered list style",
  "tags": [ "bullet", "ul" ],
  "aliases": [ "ul-style" ],
  "regexp": expressions.listItemMarkerRe,
  "func": function MD004(params, errors) {
    var style = params.options.style || "consistent";
    var expectedStyle = style;
    var nestingStyles = [];
    shared.flattenLists(params).forEach(function forList(list) {
      if (list.unordered) {
        if (expectedStyle === "consistent") {
          expectedStyle = shared.unorderedListStyleFor(list.items[0]);
        }
        list.items.forEach(function forItem(item) {
          var itemStyle = shared.unorderedListStyleFor(item);
          if (style === "sublist") {
            var nesting = list.nesting;
            if (!nestingStyles[nesting] &&
              (itemStyle !== nestingStyles[nesting - 1])) {
              nestingStyles[nesting] = itemStyle;
            } else {
              errors.addDetailIf(item.lineNumber,
                nestingStyles[nesting], itemStyle);
            }
          } else {
            errors.addDetailIf(item.lineNumber, expectedStyle, itemStyle);
          }
        });
      }
    });
  }
};

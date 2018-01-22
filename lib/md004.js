// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD004", "ul-style" ],
  "description": "Unordered list style",
  "tags": [ "bullet", "ul" ],
  "function": function MD004(params, onError) {
    var style = params.config.style || "consistent";
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
              shared.addErrorDetailIf(onError, item.lineNumber,
                nestingStyles[nesting], itemStyle, null,
                shared.rangeFromRegExp(item.line, shared.listItemMarkerRe));
            }
          } else {
            shared.addErrorDetailIf(onError, item.lineNumber,
              expectedStyle, itemStyle, null,
              shared.rangeFromRegExp(item.line, shared.listItemMarkerRe));
          }
        });
      }
    });
  }
};

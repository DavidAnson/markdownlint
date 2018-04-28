// @ts-check

"use strict";

const shared = require("./shared");

// Returns the unordered list style for a list item token
function unorderedListStyleFor(token) {
  switch (token.markup) {
    case "-":
      return "dash";
    case "+":
      return "plus";
    // case "*":
    default:
      return "asterisk";
  }
}

module.exports = {
  "names": [ "MD004", "ul-style" ],
  "description": "Unordered list style",
  "tags": [ "bullet", "ul" ],
  "function": function MD004(params, onError) {
    const style = params.config.style || "consistent";
    let expectedStyle = style;
    const nestingStyles = [];
    shared.flattenLists().forEach(function forList(list) {
      if (list.unordered) {
        if (expectedStyle === "consistent") {
          expectedStyle = unorderedListStyleFor(list.items[0]);
        }
        list.items.forEach(function forItem(item) {
          const itemStyle = unorderedListStyleFor(item);
          if (style === "sublist") {
            const nesting = list.nesting;
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

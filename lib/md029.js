// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD029", "ol-prefix" ],
  "description": "Ordered list item prefix",
  "tags": [ "ol" ],
  "function": function MD029(params, onError) {
    const style = params.config.style || "one_or_ordered";
    shared.flattenLists().forEach(function forList(list) {
      if (!list.unordered) {
        let listStyle = style;
        if (listStyle === "one_or_ordered") {
          const second = (list.items.length > 1) &&
            shared.orderedListItemMarkerRe.exec(list.items[1].line);
          listStyle = (second && (second[1] !== "1")) ? "ordered" : "one";
        }
        let number = 1;
        list.items.forEach(function forItem(item) {
          const match = shared.orderedListItemMarkerRe.exec(item.line);
          shared.addErrorDetailIf(onError, item.lineNumber,
            String(number), !match || match[1],
            "Style: " + (listStyle === "one" ? "1/1/1" : "1/2/3"),
            shared.rangeFromRegExp(item.line, shared.listItemMarkerRe));
          if (listStyle === "ordered") {
            number++;
          }
        });
      }
    });
  }
};

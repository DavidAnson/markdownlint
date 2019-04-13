// @ts-check

"use strict";

const { addErrorDetailIf, listItemMarkerRe, orderedListItemMarkerRe,
  rangeFromRegExp } = require("../helpers");
const { flattenedLists } = require("./cache");

const listStyleExamples = {
  "one": "1/1/1",
  "ordered": "1/2/3",
  "zero": "0/0/0"
};

module.exports = {
  "names": [ "MD029", "ol-prefix" ],
  "description": "Ordered list item prefix",
  "tags": [ "ol" ],
  "function": function MD029(params, onError) {
    const style = params.config.style || "one_or_ordered";
    flattenedLists().forEach((list) => {
      if (!list.unordered) {
        let listStyle = style;
        if (listStyle === "one_or_ordered") {
          const second = (list.items.length > 1) &&
            orderedListItemMarkerRe.exec(list.items[1].line);
          listStyle = (second && (second[1] !== "1")) ? "ordered" : "one";
        }
        let number = (listStyle === "zero") ? 0 : 1;
        list.items.forEach((item) => {
          const match = orderedListItemMarkerRe.exec(item.line);
          addErrorDetailIf(onError, item.lineNumber,
            String(number), !match || match[1],
            "Style: " + listStyleExamples[listStyle], null,
            rangeFromRegExp(item.line, listItemMarkerRe));
          if (listStyle === "ordered") {
            number++;
          }
        });
      }
    });
  }
};

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
    const style = String(params.config.style || "one_or_ordered");
    const filteredLists = flattenedLists().filter((list) => !list.unordered);
    for (const list of filteredLists) {
      const { items } = list;
      let current = 1;
      let incrementing = false;
      // Check for incrementing number pattern 1/2/3 or 0/1/2
      if (items.length >= 2) {
        const first = orderedListItemMarkerRe.exec(items[0].line);
        const second = orderedListItemMarkerRe.exec(items[1].line);
        if (first && second) {
          const [ , firstNumber ] = first;
          const [ , secondNumber ] = second;
          if ((secondNumber !== "1") || (firstNumber === "0")) {
            incrementing = true;
            if (firstNumber === "0") {
              current = 0;
            }
          }
        }
      }
      // Determine effective style
      let listStyle = style;
      if (listStyle === "one_or_ordered") {
        listStyle = incrementing ? "ordered" : "one";
      }
      // Force expected value for 0/0/0 and 1/1/1 patterns
      if (listStyle === "zero") {
        current = 0;
      } else if (listStyle === "one") {
        current = 1;
      }
      // Validate each list item marker
      for (const item of items) {
        const match = orderedListItemMarkerRe.exec(item.line);
        if (match) {
          addErrorDetailIf(onError, item.lineNumber,
            String(current), match[1],
            "Style: " + listStyleExamples[listStyle], null,
            rangeFromRegExp(item.line, listItemMarkerRe));
          if (listStyle === "ordered") {
            current++;
          }
        }
      }
    }
  }
};

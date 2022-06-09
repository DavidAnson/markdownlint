// @ts-check

"use strict";

const { addErrorDetailIf, listItemMarkerRe, unorderedListStyleFor } =
  require("../helpers");
const { flattenedLists } = require("./cache");

const expectedStyleToMarker = {
  "dash": "-",
  "plus": "+",
  "asterisk": "*"
};
const differentItemStyle = {
  "dash": "plus",
  "plus": "asterisk",
  "asterisk": "dash"
};
const validStyles = Object.keys(expectedStyleToMarker);

module.exports = {
  "names": [ "MD004", "ul-style" ],
  "description": "Unordered list style",
  "tags": [ "bullet", "ul" ],
  "function": function MD004(params, onError) {
    const style = String(params.config.style || "consistent");
    let expectedStyle = style;
    const nestingStyles = [];
    for (const list of flattenedLists()) {
      if (list.unordered) {
        if (expectedStyle === "consistent") {
          expectedStyle = unorderedListStyleFor(list.items[0]);
        }
        for (const item of list.items) {
          const itemStyle = unorderedListStyleFor(item);
          if (style === "sublist") {
            const nesting = list.nesting;
            if (!nestingStyles[nesting]) {
              nestingStyles[nesting] =
                (itemStyle === nestingStyles[nesting - 1]) ?
                  differentItemStyle[itemStyle] :
                  itemStyle;
            }
            expectedStyle = nestingStyles[nesting];
          }
          if (!validStyles.includes(expectedStyle)) {
            expectedStyle = validStyles[0];
          }
          let range = null;
          let fixInfo = null;
          const match = item.line.match(listItemMarkerRe);
          if (match) {
            const column = match.index + 1;
            const length = match[0].length;
            range = [ column, length ];
            fixInfo = {
              "editColumn": match[1].length + 1,
              "deleteCount": 1,
              "insertText": expectedStyleToMarker[expectedStyle]
            };
          }
          addErrorDetailIf(
            onError,
            item.lineNumber,
            expectedStyle,
            itemStyle,
            null,
            null,
            range,
            fixInfo
          );
        }
      }
    }
  }
};

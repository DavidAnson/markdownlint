// @ts-check

"use strict";

const shared = require("./shared");

const listItemMarkerInterruptsRe = /^[\s>]*(?:[*+-]|1\.)\s+/;
const blankOrListRe = /^[\s>]*($|\s)/;

module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "function": function MD032(params, onError) {
    let inList = false;
    let prevLine = "";
    shared.forEachLine(
      function forLine(line, lineIndex, inCode, onFence) {
        if (!inCode || onFence) {
          const lineTrim = line.trim();
          let listMarker = shared.listItemMarkerRe.test(lineTrim);
          if (listMarker && !inList && !blankOrListRe.test(prevLine)) {
            // Check whether this list prefix can interrupt a paragraph
            if (listItemMarkerInterruptsRe.test(lineTrim)) {
              shared.addErrorContext(onError, lineIndex + 1, lineTrim);
            } else {
              listMarker = false;
            }
          } else if (!listMarker && inList && !blankOrListRe.test(line)) {
            shared.addErrorContext(onError, lineIndex, lineTrim);
          }
          inList = listMarker;
        }
        prevLine = line;
      }
    );
  }
};

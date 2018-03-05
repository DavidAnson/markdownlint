// @ts-check

"use strict";

var shared = require("./shared");

var listItemMarkerInterruptsRe = /^[\s>]*(?:[*+-]|1\.)\s+/;
var blankOrListRe = /^[\s>]*($|\s)/;

module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "function": function MD032(params, onError) {
    var inList = false;
    var prevLine = "";
    shared.forEachLine(
      function forLine(line, lineIndex, inCode, onFence) {
        if (!inCode || onFence) {
          var lineTrim = line.trim();
          var listMarker = shared.listItemMarkerRe.test(lineTrim);
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

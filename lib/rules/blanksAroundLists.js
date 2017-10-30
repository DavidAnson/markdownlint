var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD032",
  "desc": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "aliases": [ "blanks-around-lists" ],
  "regexp": null,
  "func": function MD032(params, errors) {
    var blankOrListRe = /^[\s>]*($|\s)/;
    var inList = false;
    var prevLine = "";
    shared.forEachLine(params, function forLine(line, lineIndex, inCode, onFence) {
      if (!inCode || onFence) {
        var lineTrim = line.trim();
        var listMarker = expressions.listItemMarkerRe.test(lineTrim);
        if (listMarker && !inList && !blankOrListRe.test(prevLine)) {
          // Check whether this list prefix can interrupt a paragraph
          if (expressions.listItemMarkerInterruptsRe.test(lineTrim)) {
            errors.addContext(lineIndex + 1, lineTrim);
          } else {
            listMarker = false;
          }
        } else if (!listMarker && inList && !blankOrListRe.test(line)) {
          errors.addContext(lineIndex, lineTrim);
        }
        inList = listMarker;
      }
      prevLine = line;
    });
  }
};

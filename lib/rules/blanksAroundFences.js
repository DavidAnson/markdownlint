var expressions = require("../expressions");
var shared = require("../shared");

module.exports = {
  "name": "MD031",
  "desc": "Fenced code blocks should be surrounded by blank lines",
  "tags": [ "code", "blank_lines" ],
  "aliases": [ "blanks-around-fences" ],
  "regexp": null,
  "func": function MD031(params, errors) {
    var lines = params.lines;
    shared.forEachLine(params, function forLine(line, i, inCode, onFence) {
      if (((onFence > 0) && (i - 1 >= 0) && lines[i - 1].length) ||
          ((onFence < 0) && (i + 1 < lines.length) && lines[i + 1].length)) {
        errors.addContext(i + 1, lines[i].trim());
      }
    });
  }
};

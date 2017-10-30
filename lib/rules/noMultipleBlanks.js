var shared = require("../shared");

module.exports = {
  "name": "MD012",
  "desc": "Multiple consecutive blank lines",
  "tags": [ "whitespace", "blank_lines" ],
  "aliases": [ "no-multiple-blanks" ],
  "regexp": null,
  "func": function MD012(params, errors) {
    var maximum = params.options.maximum || 1;
    var count = 0;
    shared.forEachLine(params, function forLine(line, lineIndex, inCode) {
      count = (inCode || line.trim().length) ? 0 : count + 1;
      if (maximum < count) {
        errors.addDetailIf(lineIndex + 1, maximum, count);
      }
    });
  }
};

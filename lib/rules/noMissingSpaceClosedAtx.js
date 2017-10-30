var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD020",
  "desc": "No space inside hashes on closed atx style header",
  "tags": [ "headers", "atx_closed", "spaces" ],
  "aliases": [ "no-missing-space-closed-atx" ],
  "regexp": expressions.atxClosedHeaderNoSpaceRe,
  "func": function MD020(params, errors) {
    shared.forEachLine(params, function forLine(line, lineIndex, inCode) {
      if (!inCode && /^#+[^#]*[^\\]#+$/.test(line)) {
        var left = /^#+[^#\s]/.test(line);
        var right = /[^#\s]#+$/.test(line);
        if (left || right) {
          errors.addContext(lineIndex + 1, line.trim(), left, right);
        }
      }
    });
  }
};

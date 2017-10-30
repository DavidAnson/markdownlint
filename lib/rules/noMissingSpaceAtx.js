var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD018",
  "desc": "No space after hash on atx style header",
  "tags": [ "headers", "atx", "spaces" ],
  "aliases": [ "no-missing-space-atx" ],
  "regexp": expressions.atxHeaderSpaceRe,
  "func": function MD018(params, errors) {
    shared.forEachLine(params, function forLine(line, lineIndex, inCode) {
      if (!inCode && /^#+[^#\s]/.test(line) && !/#$/.test(line)) {
        errors.addContext(lineIndex + 1, line.trim());
      }
    });
  }
};

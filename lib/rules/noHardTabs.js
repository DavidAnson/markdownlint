var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD010",
  "desc": "Hard tabs",
  "tags": [ "whitespace", "hard_tab" ],
  "aliases": [ "no-hard-tabs" ],
  "regexp": expressions.tabRe,
  "func": function MD010(params, errors) {
    var codeBlocks = params.options.code_blocks;
    var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    shared.forEachLine(params, function forLine(line, lineIndex, inCode) {
      if (expressions.tabRe.test(line) && (!inCode || includeCodeBlocks)) {
        errors.addDetail(lineIndex + 1,
          "Column: " + (line.indexOf("\t") + 1));
      }
    });
  }
};

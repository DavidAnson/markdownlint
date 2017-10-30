var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD044",
  "desc": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "aliases": [ "proper-names" ],
  "regexp": null,
  "func": function MD044(params, errors) {
    var names = params.options.names || [];
    var codeBlocks = params.options.code_blocks;
    var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    names.forEach(function forName(name) {
      var escapedName = shared.escapeForRegExp(name);
      var namePattern = "\\S*\\b(" + escapedName + ")\\b\\S*";
      var anyNameRe = new RegExp(namePattern, "gi");
      function forToken(token) {
        var fenceOffset = (token.type === "fence") ? 1 : 0;
        token.content.split(shared.newLineRe)
          .forEach(function forLine(line, index) {
            var match = null;
            while ((match = anyNameRe.exec(line)) !== null) {
              var fullMatch = match[0];
              if (!expressions.bareUrlRe.test(fullMatch)) {
                var wordMatch = fullMatch
                  .replace(/^\W*/, "").replace(/\W*$/, "");
                if (names.indexOf(wordMatch) === -1) {
                  var lineNumber = token.lineNumber + index + fenceOffset;
                  errors.addDetailIf(lineNumber, name, match[1]);
                }
              }
            }
          });
      }
      shared.forEachInlineChild(params, "text", forToken);
      if (includeCodeBlocks) {
        shared.forEachInlineChild(params, "code_inline", forToken);
        shared.filterTokens(params, "code_block", forToken);
        shared.filterTokens(params, "fence", forToken);
      }
    });
  }
};

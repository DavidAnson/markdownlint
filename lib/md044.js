// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD044", "proper-names" ],
  "description": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "function": function MD044(params, onError) {
    var names = params.config.names || [];
    var codeBlocks = params.config.code_blocks;
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
              if (!shared.bareUrlRe.test(fullMatch)) {
                var wordMatch = fullMatch
                  .replace(/^\W*/, "").replace(/\W*$/, "");
                if (names.indexOf(wordMatch) === -1) {
                  var lineNumber = token.lineNumber + index + fenceOffset;
                  var range = [ match.index + 1, wordMatch.length ];
                  shared.addErrorDetailIf(onError, lineNumber,
                    name, match[1], null, range);
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

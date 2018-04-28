// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD044", "proper-names" ],
  "description": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "function": function MD044(params, onError) {
    const names = params.config.names || [];
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    names.forEach(function forName(name) {
      const escapedName = shared.escapeForRegExp(name);
      const namePattern = "\\S*\\b(" + escapedName + ")\\b\\S*";
      const anyNameRe = new RegExp(namePattern, "gi");
      function forToken(token) {
        const fenceOffset = (token.type === "fence") ? 1 : 0;
        token.content.split(shared.newLineRe)
          .forEach(function forLine(line, index) {
            let match = null;
            while ((match = anyNameRe.exec(line)) !== null) {
              const fullMatch = match[0];
              if (!shared.bareUrlRe.test(fullMatch)) {
                const wordMatch = fullMatch
                  .replace(/^\W*/, "").replace(/\W*$/, "");
                if (names.indexOf(wordMatch) === -1) {
                  const lineNumber = token.lineNumber + index + fenceOffset;
                  const range = [ match.index + 1, wordMatch.length ];
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

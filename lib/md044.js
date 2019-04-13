// @ts-check

"use strict";

const { addErrorDetailIf, bareUrlRe, escapeForRegExp, filterTokens,
  forEachInlineChild, newLineRe } = require("../helpers");

module.exports = {
  "names": [ "MD044", "proper-names" ],
  "description": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "function": function MD044(params, onError) {
    const names = params.config.names || [];
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    names.forEach((name) => {
      const escapedName = escapeForRegExp(name);
      const namePattern = "\\S*\\b(" + escapedName + ")\\b\\S*";
      const anyNameRe = new RegExp(namePattern, "gi");
      function forToken(token) {
        const fenceOffset = (token.type === "fence") ? 1 : 0;
        token.content.split(newLineRe)
          .forEach((line, index) => {
            let match = null;
            while ((match = anyNameRe.exec(line)) !== null) {
              const fullMatch = match[0];
              if (!bareUrlRe.test(fullMatch)) {
                const wordMatch = fullMatch
                  .replace(/^\W*/, "").replace(/\W*$/, "");
                if (!names.includes(wordMatch)) {
                  const lineNumber = token.lineNumber + index + fenceOffset;
                  const range = [ match.index + 1, wordMatch.length ];
                  addErrorDetailIf(onError, lineNumber,
                    name, match[1], null, null, range);
                }
              }
            }
          });
      }
      forEachInlineChild(params, "text", forToken);
      if (includeCodeBlocks) {
        forEachInlineChild(params, "code_inline", forToken);
        filterTokens(params, "code_block", forToken);
        filterTokens(params, "fence", forToken);
      }
    });
  }
};

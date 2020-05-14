// @ts-check

"use strict";

const { addErrorDetailIf, bareUrlRe, escapeForRegExp, filterTokens,
  forEachInlineChild, newLineRe } = require("../helpers");

module.exports = {
  "names": [ "MD044", "proper-names" ],
  "description": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "function": function MD044(params, onError) {
    let names = params.config.names;
    names = Array.isArray(names) ? names : [];
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    names.forEach((name) => {
      const escapedName = escapeForRegExp(name);
      const namePattern = "\\S*\\b(" + escapedName + ")\\b\\S*";
      const anyNameRe = new RegExp(namePattern, "gi");
      // eslint-disable-next-line jsdoc/require-jsdoc
      function forToken(token) {
        const fenceOffset = (token.type === "fence") ? 1 : 0;
        token.content.split(newLineRe)
          .forEach((line, index) => {
            let match = null;
            while ((match = anyNameRe.exec(line)) !== null) {
              const fullMatch = match[0];
              if (fullMatch.search(bareUrlRe) === -1) {
                const wordMatch = fullMatch
                  .replace(/^\W*/, "").replace(/\W*$/, "");
                if (!names.includes(wordMatch)) {
                  const lineNumber = token.lineNumber + index + fenceOffset;
                  const fullLine = params.lines[lineNumber - 1];
                  let matchIndex = match.index;
                  const matchLength = wordMatch.length;
                  const fullLineWord =
                    fullLine.slice(matchIndex, matchIndex + matchLength);
                  if (fullLineWord !== wordMatch) {
                    // Attempt to fix bad offset due to inline content
                    matchIndex = fullLine.indexOf(wordMatch);
                  }
                  const range = (matchIndex === -1) ?
                    null :
                    [ matchIndex + 1, matchLength ];
                  const fixInfo = (matchIndex === -1) ? null : {
                    "editColumn": matchIndex + 1,
                    "deleteCount": matchLength,
                    "insertText": name
                  };
                  addErrorDetailIf(
                    onError,
                    lineNumber,
                    name,
                    match[1],
                    null,
                    null,
                    range,
                    fixInfo
                  );
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

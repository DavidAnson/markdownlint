// @ts-check

"use strict";

const { addErrorDetailIf, bareUrlRe, escapeForRegExp, filterTokens,
  forEachInlineChild, newLineRe } = require("../helpers");

const startNonWordRe = /^\W/;
const endNonWordRe = /\W$/;

module.exports = {
  "names": [ "MD044", "proper-names" ],
  "description": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "function": function MD044(params, onError) {
    let names = params.config.names;
    names = Array.isArray(names) ? names : [];
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    // Text of automatic hyperlinks is implicitly a URL
    const autolinkText = new Set();
    filterTokens(params, "inline", (token) => {
      let inAutoLink = false;
      token.children.forEach((child) => {
        const { info, type } = child;
        if ((type === "link_open") && (info === "auto")) {
          inAutoLink = true;
        } else if (type === "link_close") {
          inAutoLink = false;
        } else if ((type === "text") && inAutoLink) {
          autolinkText.add(child);
        }
      });
    });
    // For each proper name...
    names.forEach((name) => {
      const escapedName = escapeForRegExp(name);
      const startNamePattern = startNonWordRe.test(name) ? "" : "\\S*\\b";
      const endNamePattern = endNonWordRe.test(name) ? "" : "\\b\\S*";
      const namePattern =
        `(${startNamePattern})(${escapedName})(${endNamePattern})`;
      const anyNameRe = new RegExp(namePattern, "gi");
      // eslint-disable-next-line jsdoc/require-jsdoc
      function forToken(token) {
        if (!autolinkText.has(token)) {
          const fenceOffset = (token.type === "fence") ? 1 : 0;
          token.content.split(newLineRe).forEach((line, index) => {
            let match = null;
            while ((match = anyNameRe.exec(line)) !== null) {
              const [ fullMatch, leftMatch, nameMatch, rightMatch ] = match;
              if (fullMatch.search(bareUrlRe) === -1) {
                const wordMatch = fullMatch
                  .replace(new RegExp(`^\\W{0,${leftMatch.length}}`), "")
                  .replace(new RegExp(`\\W{0,${rightMatch.length}}$`), "");
                if (!names.includes(wordMatch)) {
                  const lineNumber = token.lineNumber + index + fenceOffset;
                  const fullLine = params.lines[lineNumber - 1];
                  const matchLength = wordMatch.length;
                  const matchIndex = fullLine.indexOf(wordMatch);
                  const range = (matchIndex === -1) ?
                    null :
                    [ matchIndex + 1, matchLength ];
                  const fixInfo = (matchIndex === -1) ?
                    null :
                    {
                      "editColumn": matchIndex + 1,
                      "deleteCount": matchLength,
                      "insertText": name
                    };
                  addErrorDetailIf(
                    onError,
                    lineNumber,
                    name,
                    nameMatch,
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

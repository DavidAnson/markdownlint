// @ts-check

"use strict";

const { addErrorDetailIf, bareUrlRe, escapeForRegExp, forEachLine,
  overlapsAnyRange, linkRe, linkReferenceRe } = require("../helpers");
const { codeBlockAndSpanRanges, lineMetadata } = require("./cache");

module.exports = {
  "names": [ "MD044", "proper-names" ],
  "description": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "function": function MD044(params, onError) {
    let names = params.config.names;
    names = Array.isArray(names) ? names : [];
    names.sort((a, b) => (b.length - a.length) || a.localeCompare(b));
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    const exclusions = [];
    forEachLine(lineMetadata(), (line, lineIndex) => {
      if (linkReferenceRe.test(line)) {
        exclusions.push([ lineIndex, 0, line.length ]);
      } else {
        let match = null;
        while ((match = bareUrlRe.exec(line)) !== null) {
          exclusions.push([ lineIndex, match.index, match[0].length ]);
        }
        while ((match = linkRe.exec(line)) !== null) {
          const [ , text, destination ] = match;
          if (destination) {
            exclusions.push(
              [ lineIndex, match.index + text.length, destination.length ]
            );
          }
        }
      }
    });
    if (!includeCodeBlocks) {
      exclusions.push(...codeBlockAndSpanRanges());
    }
    for (const name of names) {
      const escapedName = escapeForRegExp(name);
      const startNamePattern = /^\W/.test(name) ? "" : "\\b_*";
      const endNamePattern = /\W$/.test(name) ? "" : "_*\\b";
      const namePattern =
        `(${startNamePattern})(${escapedName})${endNamePattern}`;
      const nameRe = new RegExp(namePattern, "gi");
      forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence) => {
        if (includeCodeBlocks || (!inCode && !onFence)) {
          let match = null;
          while ((match = nameRe.exec(line)) !== null) {
            const [ , leftMatch, nameMatch ] = match;
            const index = match.index + leftMatch.length;
            const length = nameMatch.length;
            if (!overlapsAnyRange(exclusions, lineIndex, index, length)) {
              addErrorDetailIf(
                onError,
                lineIndex + 1,
                name,
                nameMatch,
                null,
                null,
                [ index + 1, length ],
                {
                  "editColumn": index + 1,
                  "deleteCount": length,
                  "insertText": name
                }
              );
            }
            exclusions.push([ lineIndex, index, length ]);
          }
        }
      });
    }
  }
};

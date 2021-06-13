// @ts-check

"use strict";

const { addErrorDetailIf, bareUrlRe, escapeForRegExp, forEachLine, newLineRe,
  forEachInlineCodeSpan } = require("../helpers");
const { lineMetadata } = require("./cache");

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
    if (!includeCodeBlocks) {
      forEachInlineCodeSpan(
        params.lines.join("\n"),
        (code, lineIndex, columnIndex) => {
          const codeLines = code.split(newLineRe);
          // eslint-disable-next-line unicorn/no-for-loop
          for (let i = 0; i < codeLines.length; i++) {
            exclusions.push(
              [ lineIndex + i, columnIndex, codeLines[i].length ]
            );
            columnIndex = 0;
          }
        }
      );
    }
    for (const name of names) {
      const escapedName = escapeForRegExp(name);
      const startNamePattern = /^\W/.test(name) ? "" : "[^\\s([\"]*\\b_*";
      const endNamePattern = /\W$/.test(name) ? "" : "_*\\b[^\\s)\\]\"]*";
      const namePattern =
        `(${startNamePattern})(${escapedName})${endNamePattern}`;
      const nameRe = new RegExp(namePattern, "gi");
      forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence) => {
        if (includeCodeBlocks || (!inCode && !onFence)) {
          let match = null;
          while ((match = nameRe.exec(line)) !== null) {
            const [ fullMatch, leftMatch, nameMatch ] = match;
            const index = match.index + leftMatch.length;
            const length = nameMatch.length;
            if (
              (fullMatch.search(bareUrlRe) === -1) &&
              exclusions.every((span) => (
                (lineIndex !== span[0]) ||
                (index + length < span[1]) ||
                (index > span[1] + span[2])
              ))
            ) {
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

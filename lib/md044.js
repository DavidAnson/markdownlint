// @ts-check

"use strict";

const { addErrorDetailIf, bareUrlRe, escapeForRegExp, forEachLine,
  forEachLink, withinAnyRange, linkReferenceDefinitionRe } =
  require("../helpers");
const { codeBlockAndSpanRanges, htmlElementRanges, lineMetadata } =
  require("./cache");

module.exports = {
  "names": [ "MD044", "proper-names" ],
  "description": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "function": function MD044(params, onError) {
    let names = params.config.names;
    names = Array.isArray(names) ? names : [];
    names.sort((a, b) => (b.length - a.length) || a.localeCompare(b));
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks =
      (codeBlocks === undefined) ? true : !!codeBlocks;
    const htmlElements = params.config.html_elements;
    const includeHtmlElements =
      (htmlElements === undefined) ? true : !!htmlElements;
    const exclusions = [];
    forEachLine(lineMetadata(), (line, lineIndex) => {
      if (linkReferenceDefinitionRe.test(line)) {
        exclusions.push([ lineIndex, 0, line.length ]);
      } else {
        let match = null;
        while ((match = bareUrlRe.exec(line)) !== null) {
          exclusions.push([ lineIndex, match.index, match[0].length ]);
        }
        forEachLink(line, (index, _, text, destination) => {
          if (destination) {
            exclusions.push(
              [ lineIndex, index + text.length, destination.length ]
            );
          }
        });
      }
    });
    if (!includeCodeBlocks) {
      exclusions.push(...codeBlockAndSpanRanges());
    }
    if (!includeHtmlElements) {
      exclusions.push(...htmlElementRanges());
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
            if (
              !withinAnyRange(exclusions, lineIndex, index, length) &&
              !names.includes(nameMatch)
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

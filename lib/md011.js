// @ts-check

"use strict";

const { addError, hasOverlap } = require("../helpers");
const { addRangeToSet } = require("../helpers/micromark-helpers.cjs");
const { filterByTypesCached } = require("./cache");

const reversedLinkRe =
  /(^|[^\\])\(([^()]+)\)\[([^\]^][^\]]*)\](?!\()/g;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "parser": "micromark",
  "function": function MD011(params, onError) {
    const codeBlockLineNumbers = new Set();
    for (const codeBlock of filterByTypesCached([ "codeFenced", "codeIndented" ])) {
      addRangeToSet(codeBlockLineNumbers, codeBlock.startLine, codeBlock.endLine);
    }
    const codeTexts = filterByTypesCached([ "codeText" ]);
    for (const [ lineIndex, line ] of params.lines.entries()) {
      const lineNumber = lineIndex + 1;
      if (!codeBlockLineNumbers.has(lineNumber)) {
        let match = null;
        while ((match = reversedLinkRe.exec(line)) !== null) {
          const [ reversedLink, preChar, linkText, linkDestination ] = match;
          if (
            !linkText.endsWith("\\") &&
            !linkDestination.endsWith("\\")
          ) {
            const column = match.index + preChar.length + 1;
            const length = match[0].length - preChar.length;
            /** @type {import("../helpers").FileRange} */
            const range = { "startLine": lineNumber, "startColumn": column, "endLine": lineNumber, "endColumn": column + length - 1 };
            if (!codeTexts.some((codeText) => hasOverlap(codeText, range))) {
              addError(
                onError,
                lineNumber,
                reversedLink.slice(preChar.length),
                undefined,
                [ column, length ],
                {
                  "editColumn": column,
                  "deleteCount": length,
                  "insertText": `[${linkText}](${linkDestination})`
                }
              );
            }
          }
        }
      }
    }
  }
};

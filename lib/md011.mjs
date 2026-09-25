// @ts-check

import { re } from "re2js";
import { addError, hasOverlap } from "../helpers/helpers.cjs";
import { addRangeToSet } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

/** @typedef {typeof import("micromark-extension-math")} _ambient_ */

const reversedLinkRe = re`(^|[^\\])\(([^()]+)\)\[([^\]^][^\]]*)\]`;

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "parser": "micromark",
  "function": function MD011(params, onError) {
    const ignoreBlockLineNumbers = new Set();
    for (const ignoreBlock of filterByTypesCached([ "codeFenced", "codeIndented", "mathFlow" ])) {
      addRangeToSet(ignoreBlockLineNumbers, ignoreBlock.startLine, ignoreBlock.endLine);
    }
    const ignoreTexts = filterByTypesCached([ "codeText", "mathText" ]);
    for (const [ lineIndex, line ] of params.lines.entries()) {
      const lineNumber = lineIndex + 1;
      if (!ignoreBlockLineNumbers.has(lineNumber)) {
        for (const match of reversedLinkRe.matchAll(line)) {
          const [ reversedLink, preChar, linkText, linkDestination ] = match;
          const matchIndex = match.index ?? 0;
          const matchLength = match[0].length;
          if (
            (line[matchIndex + matchLength] !== "(") &&
            !linkText.endsWith("\\") &&
            !linkDestination.endsWith("\\")
          ) {
            const column = matchIndex + preChar.length + 1;
            const length = matchLength - preChar.length;
            /** @type {import("../helpers/helpers.cjs").FileRange} */
            const range = { "startLine": lineNumber, "startColumn": column, "endLine": lineNumber, "endColumn": column + length - 1 };
            if (!ignoreTexts.some((ignoreText) => hasOverlap(ignoreText, range))) {
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

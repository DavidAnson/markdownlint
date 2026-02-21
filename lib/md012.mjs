// @ts-check

import { addErrorDetailIf, isBlankLine } from "../helpers/helpers.cjs";
import { addRangeToSet } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD012", "no-multiple-blanks" ],
  "description": "Multiple consecutive blank lines",
  "tags": [ "whitespace", "blank_lines" ],
  "parser": "micromark",
  "function": function MD012(params, onError) {
    const maximum = Number(params.config.maximum || 1);
    const { lines } = params;
    const codeBlockLineNumbers = new Set();
    for (const codeBlock of filterByTypesCached([ "codeFenced", "codeIndented" ])) {
      addRangeToSet(codeBlockLineNumbers, codeBlock.startLine, codeBlock.endLine);
    }

    // Pre-compute blank lines adjacent to headings. Heading spacing is
    // governed by MD022 (blanks-around-headings), so MD012 defers to it
    // and does not flag blank lines immediately above or below a heading.
    const headingAdjacentBlanks = new Set();
    for (const heading of filterByTypesCached([ "atxHeading", "setextHeading" ])) {
      let i = heading.startLine - 1;
      while (i >= 1 && isBlankLine(lines[i - 1])) {
        headingAdjacentBlanks.add(i);
        i--;
      }
      i = heading.endLine + 1;
      while (i <= lines.length && isBlankLine(lines[i - 1])) {
        headingAdjacentBlanks.add(i);
        i++;
      }
    }

    let count = 0;
    for (const [ lineIndex, line ] of lines.entries()) {
      const lineNumber = lineIndex + 1;
      const inCode = codeBlockLineNumbers.has(lineNumber);
      count = (inCode || (line.trim().length > 0)) ? 0 : count + 1;
      if (maximum < count && !headingAdjacentBlanks.has(lineNumber)) {
        addErrorDetailIf(
          onError,
          lineNumber,
          maximum,
          count,
          undefined,
          undefined,
          undefined,
          {
            "deleteCount": -1
          }
        );
      }
    }
  }
};

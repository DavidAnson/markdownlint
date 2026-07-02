// @ts-check

import { addErrorDetailIf, isBlankLine } from "../helpers/helpers.cjs";
import { getBlockQuotePrefixText, getHeadingLevel } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

/** @typedef {import("markdownlint").MicromarkToken} MicromarkToken */

const defaultLines = 1;

// eslint-disable-next-line jsdoc/reject-any-type
const getLinesFunction = (/** @type {any} */ linesParam) => {
  if (Array.isArray(linesParam)) {
    // eslint-disable-next-line unicorn/no-unreadable-new-expression
    const linesArray = new Array(6).fill(defaultLines);
    for (const [ index, value ] of [ ...linesParam.entries() ].slice(0, 6)) {
      linesArray[index] = value;
    }
    return (/** @type {MicromarkToken} */ heading) => linesArray[getHeadingLevel(heading) - 1];
  }
  // Coerce linesParam to a number
  const lines = (linesParam === undefined) ? defaultLines : Number(linesParam);
  return () => lines;
};

const getLine = (/** @type {readonly string[]} */ lines, /** @type {number} */ index, /** @type {readonly string[]} */ frontMatterLines, /** @type {boolean} */ includeFrontMatter) => {
  if ((index >= 0) && (index < lines.length)) {
    return lines[index];
  }
  if (includeFrontMatter && (frontMatterLines.length > 0) && (index < 0) && (index >= -frontMatterLines.length)) {
    return frontMatterLines[frontMatterLines.length + index];
  }
  return "";
};

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD022", "blanks-around-headings" ],
  "description": "Headings should be surrounded by blank lines",
  "tags": [ "headings", "blank_lines" ],
  "parser": "micromark",
  "function": function MD022(params, onError) {
    const getLinesAbove = getLinesFunction(params.config.lines_above);
    const getLinesBelow = getLinesFunction(params.config.lines_below);
    const includeFrontMatter = !!params.config.include_front_matter;
    const { lines, frontMatterLines } = params;
    const blockQuotePrefixes = filterByTypesCached([ "blockQuotePrefix", "linePrefix" ]);
    for (const heading of filterByTypesCached([ "atxHeading", "setextHeading" ])) {
      const { startLine, endLine } = heading;
      const line = lines[startLine - 1].trim();

      // Check lines above
      const linesAbove = getLinesAbove(heading);
      if (linesAbove >= 0) {
        let actualAbove = 0;
        for (let i = 0; (i < linesAbove) && isBlankLine(getLine(lines, startLine - 2 - i, frontMatterLines, includeFrontMatter)); i++) {
          actualAbove++;
        }
        addErrorDetailIf(
          onError,
          startLine,
          linesAbove,
          actualAbove,
          "Above",
          line,
          undefined,
          {
            "insertText": getBlockQuotePrefixText(
              blockQuotePrefixes,
              startLine - 1,
              linesAbove - actualAbove
            )
          }
        );
      }

      // Check lines below
      const linesBelow = getLinesBelow(heading);
      if (linesBelow >= 0) {
        let actualBelow = 0;
        for (let i = 0; (i < linesBelow) && isBlankLine(getLine(lines, endLine + i, frontMatterLines, false)); i++) {
          actualBelow++;
        }
        addErrorDetailIf(
          onError,
          startLine,
          linesBelow,
          actualBelow,
          "Below",
          line,
          undefined,
          {
            "lineNumber": endLine + 1,
            "insertText": getBlockQuotePrefixText(
              blockQuotePrefixes,
              endLine + 1,
              linesBelow - actualBelow
            )
          }
        );
      }
    }
  }
};

// @ts-check

import { addErrorDetailIf } from "../helpers/helpers.cjs";
import { filterByTypesCached, getReferenceLinkImageData } from "./cache.mjs";
import { addRangeToSet, getDescendantsByType } from "../helpers/micromark-helpers.cjs";

// Regular expression for a line that is not wrappable
const notWrappableRe = /^(?:[#>\s]*\s)?\S*$/;

// Regular expression for leading block quote markers and whitespace
const blockquotePrefixRe = /^(?:[ \t]*>)*[ \t]*/;

// Regular expression for a list item marker and trailing whitespace
const listItemMarkerRe = /^(?:[*+-]|\d{1,9}[.)])[ \t]+/;

// Regular expression for runs of whitespace (candidate break points)
const whitespaceRunRe = /[ \t]+/g;

// Regular expression for text that could be parsed as block structure if moved to the start of a line
const unsafeBreakTextRe = /^(?:[:<>|]|\${2}|`{3,}|~{3,}|[#=_*+-]+(?:[ \t]|$)|\d{1,9}[.)](?:[ \t]|$))/;

// Token types within which lines can not be broken
/** @type {import("markdownlint").MicromarkTokenType[]} */
const unbreakableTypes = [ "autolink", "codeText", "htmlText", "literalAutolink", "mathText", "reference", "resource" ];

/**
 * Gets fix information to wrap a long line at whitespace, if possible.
 *
 * @param {string} line Line of Markdown content.
 * @param {number} maxLength Maximum line length.
 * @param {boolean} strictLength Whether the trailing run of non-whitespace may exceed the limit.
 * @param {number[][]} unbreakableRanges Start/end (0-based, exclusive) indices that can not be broken.
 * @param {number} minBreakIndex Minimum (0-based) index at which a break may occur.
 * @returns {import("markdownlint").RuleOnErrorFixInfo | undefined} Fix information, if available.
 */
function getWrapFixInfo(line, maxLength, strictLength, unbreakableRanges, minBreakIndex) {
  // Determine the prefix to use for continuation lines
  // @ts-ignore
  const blockquotePrefix = blockquotePrefixRe.exec(line)[0];
  const listItemMarker = listItemMarkerRe.exec(line.slice(blockquotePrefix.length));
  const prefix = blockquotePrefix + (listItemMarker ? "".padEnd(listItemMarker[0].length) : "");
  // Identify all possible break points
  /** @type {number[][]} */
  const candidates = [];
  let match = null;
  whitespaceRunRe.lastIndex = 0;
  while ((match = whitespaceRunRe.exec(line)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (
      // Content precedes the break
      (start > prefix.length) &&
      // Break does not precede content altered before rules run (ex: HTML comment text)
      (start >= minBreakIndex) &&
      // Content follows the break (no trailing whitespace/hard break)
      (end < line.length) &&
      // Breaking would not create a backslash hard break
      (line[start - 1] !== "\\") &&
      // Following content would not be parsed as block structure
      !unsafeBreakTextRe.test(line.slice(end)) &&
      // Break is not within a token that can not be broken
      !unbreakableRanges.some((range) => (start < range[1]) && (end > range[0]))
    ) {
      candidates.push([ start, end ]);
    }
  }
  // Greedily choose break points so every wrapped line fits when possible
  const fits = (/** @type {string} */ text) => (strictLength ? text : text.replace(/\S*$/u, "#")).length <= maxLength;
  /** @type {number[][]} */
  const breaks = [];
  let index = 0;
  let linePrefix = "";
  while (!fits(linePrefix + line.slice(index))) {
    /** @type {number[] | null} */
    let chosen = null;
    for (const candidate of candidates) {
      if ((candidate[0] > index) && (!chosen || fits(linePrefix + line.slice(index, candidate[0])))) {
        chosen = candidate;
      }
    }
    if (!chosen) {
      break;
    }
    breaks.push(chosen);
    index = chosen[1];
    linePrefix = prefix;
  }
  if (breaks.length === 0) {
    return undefined;
  }
  // Replace text from the first break point onward with wrapped lines
  let insertText = "";
  for (let i = 0; i < breaks.length; i++) {
    const end = (i + 1 < breaks.length) ? breaks[i + 1][0] : line.length;
    insertText += "\n" + prefix + line.slice(breaks[i][1], end);
  }
  return {
    "editColumn": breaks[0][0] + 1,
    "deleteCount": line.length - breaks[0][0],
    insertText
  };
}

/** @typedef {import("micromark-extension-gfm-autolink-literal")} */
/** @typedef {import("micromark-extension-gfm-table")} */

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD013", "line-length" ],
  "description": "Line length",
  "tags": [ "line_length" ],
  "parser": "micromark",
  "function": function MD013(params, onError) {
    const lineLength = Number(params.config.line_length || 80);
    const headingLineLength = Number(params.config.heading_line_length || lineLength);
    const codeLineLength = Number(params.config.code_block_line_length || lineLength);
    const strict = !!params.config.strict;
    const stern = !!params.config.stern;
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    const tables = params.config.tables;
    const includeTables = (tables === undefined) ? true : !!tables;
    const headings = params.config.headings;
    const includeHeadings = (headings === undefined) ? true : !!headings;
    const headingLineNumbers = new Set();
    for (const heading of filterByTypesCached([ "atxHeading", "setextHeading" ])) {
      addRangeToSet(headingLineNumbers, heading.startLine, heading.endLine);
    }
    const codeBlockLineNumbers = new Set();
    for (const codeBlock of filterByTypesCached([ "codeFenced", "codeIndented" ])) {
      addRangeToSet(codeBlockLineNumbers, codeBlock.startLine, codeBlock.endLine);
    }
    const tableLineNumbers = new Set();
    for (const table of filterByTypesCached([ "table" ])) {
      addRangeToSet(tableLineNumbers, table.startLine, table.endLine);
    }
    const linkLineNumbers = new Set();
    for (const link of filterByTypesCached([ "autolink", "image", "link", "literalAutolink" ])) {
      addRangeToSet(linkLineNumbers, link.startLine, link.endLine);
    }
    const paragraphLineNumbers = new Set();
    const paragraphDataLineNumbers = new Set();
    for (const paragraph of filterByTypesCached([ "paragraph" ])) {
      addRangeToSet(paragraphLineNumbers, paragraph.startLine, paragraph.endLine);
      for (const data of getDescendantsByType(paragraph, [ "data" ])) {
        addRangeToSet(paragraphDataLineNumbers, data.startLine, data.endLine);
      }
    }
    /** @type {Map<number, number[][]>} */
    const unbreakableRangesByLine = new Map();
    /** @type {Map<number, number>} */
    const commentEndByLine = new Map();
    for (const token of filterByTypesCached(unbreakableTypes)) {
      const isComment = (token.type === "htmlText") && token.text.startsWith("<!--");
      for (let lineNumber = token.startLine; lineNumber <= token.endLine; lineNumber++) {
        const start = (lineNumber === token.startLine) ? token.startColumn - 1 : 0;
        const end = (lineNumber === token.endLine) ? token.endColumn - 1 : Number.MAX_SAFE_INTEGER;
        let ranges = unbreakableRangesByLine.get(lineNumber);
        if (!ranges) {
          ranges = [];
          unbreakableRangesByLine.set(lineNumber, ranges);
        }
        ranges.push([ start, end ]);
        if (isComment) {
          commentEndByLine.set(lineNumber, Math.max(commentEndByLine.get(lineNumber) || 0, end));
        }
      }
    }
    const linkOnlyLineNumbers = new Set();
    for (const lineNumber of linkLineNumbers) {
      if (!paragraphDataLineNumbers.has(lineNumber)) {
        linkOnlyLineNumbers.add(lineNumber);
      }
    }
    const definitionLineIndices = new Set(getReferenceLinkImageData().definitionLineIndices);
    for (let lineIndex = 0; lineIndex < params.lines.length; lineIndex++) {
      const line = params.lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const isHeading = headingLineNumbers.has(lineNumber);
      const inCode = codeBlockLineNumbers.has(lineNumber);
      const inTable = tableLineNumbers.has(lineNumber);
      const maxLength = inCode ? codeLineLength : (isHeading ? headingLineLength : lineLength);
      // If not strict/stern, the last run of non-whitespace is allowed to go
      // beyond the limit as long as it begins within the limit
      const text = (strict || stern) ? line : line.replace(/\S*$/u, "#");
      if ((maxLength > 0) &&
          (includeCodeBlocks || !inCode) &&
          (includeTables || !inTable) &&
          (includeHeadings || !isHeading) &&
          !definitionLineIndices.has(lineIndex) &&
          (strict ||
           (!(stern && notWrappableRe.test(line)) &&
            !linkOnlyLineNumbers.has(lineNumber))) &&
          (text.length > maxLength)) {
        const fixInfo = (!isHeading && !inCode && !inTable && paragraphLineNumbers.has(lineNumber)) ?
          getWrapFixInfo(line, maxLength, strict || stern, unbreakableRangesByLine.get(lineNumber) || [], commentEndByLine.get(lineNumber) || 0) :
          undefined;
        addErrorDetailIf(
          onError,
          lineNumber,
          maxLength,
          line.length,
          undefined,
          undefined,
          [ maxLength + 1, line.length - maxLength ],
          fixInfo
        );
      }
    }
  }
};

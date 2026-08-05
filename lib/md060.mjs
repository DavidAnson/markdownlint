// @ts-check

import { filterByTypes } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

// Emoji and other characters with double visual width (width 2)
// Extended_Pictographic covers graphical emoji; the remaining ranges cover
// the Wide/Fullwidth values of UAX #11 (East Asian Width, Unicode 17.0):
// https://www.unicode.org/reports/tr11/
// Note that arrows (U+2190-U+21FF) are "Ambiguous" in UAX #11 but are
// rendered double-width in CJK contexts, so they are included here.
// The U+1F200-U+1F265 range is kept explicit because only part of it is
// Extended_Pictographic (the lint rule's Unicode data disagrees with V8).
// eslint-disable-next-line regexp/no-dupe-characters-character-class
const doubleWidthRe = /[\p{Extended_Pictographic}\u{1100}-\u{115F}\u{2190}-\u{21FF}\u{2329}\u{232A}\u{2E80}-\u{2FFF}\u{3000}-\u{9FFF}\u{A000}-\u{A4CF}\u{A960}-\u{A97F}\u{AC00}-\u{D7FF}\u{F900}-\u{FAFF}\u{FE10}-\u{FE19}\u{FE30}-\u{FE6B}\u{FF01}-\u{FF60}\u{FFE0}-\u{FFE6}\u{16FE0}-\u{16FF6}\u{17000}-\u{18D1E}\u{1AFF0}-\u{1AFFE}\u{1B000}-\u{1B2FB}\u{1D300}-\u{1D376}\u{1F200}-\u{1F265}\u{20000}-\u{3FFFD}]/gu;

const segmenter = new Intl.Segmenter();

/**
 * Gets the visual width of a string (number of columns to display it).
 *
 * Computed as the number of grapheme clusters plus the number of
 * double-width characters (emoji and UAX #11 Wide/Fullwidth characters).
 *
 * @param {string} text Input text.
 * @returns {number} Visual width.
 */
function visualWidth(text) {
  let graphemes = 0;
  // eslint-disable-next-line no-unused-vars
  for (const unused of segmenter.segment(text)) {
    graphemes++;
  }
  return graphemes + (text.match(doubleWidthRe)?.length ?? 0);
}

/** @typedef {typeof import("micromark-extension-gfm-table")} _ambient_ */
/** @typedef {import("markdownlint").MicromarkToken} MicromarkToken */
/** @typedef {import("markdownlint").RuleOnErrorInfo} RuleOnErrorInfo */
/** @typedef {import("markdownlint").RuleOnErrorFixInfo} RuleOnErrorFixInfo */

/**
 * Adds a RuleOnErrorInfo object to a list of RuleOnErrorInfo objects.
 *
 * @param {RuleOnErrorInfo[]} errors List of errors.
 * @param {number} lineNumber Line number.
 * @param {number} column Column number.
 * @param {string} detail Detail message.
 * @param {RuleOnErrorFixInfo} [fixInfo] Fix information.
 */
function addError(errors, lineNumber, column, detail, fixInfo) {
  errors.push({
    lineNumber,
    detail,
    "range": [ column, 1 ],
    fixInfo
  });
}

/**
 * @typedef Column
 * @property {number} actual Actual column (1-based).
 * @property {number} effective Effective column (1-based).
 */

/**
 * Gets a list of table cell divider columns.
 *
 * @param {readonly string[]} lines File/string lines.
 * @param {MicromarkToken} row Micromark row token.
 * @returns {Column[]} Divider columns.
 */
function getTableDividerColumns(lines, row) {
  return filterByTypes(
    row.children,
    [ "tableCellDivider" ]
  ).map(
    (divider) => ({
      "actual": divider.startColumn,
      "effective": visualWidth(lines[row.startLine - 1].slice(0, divider.startColumn - 1))
    })
  );
}

/**
 * Checks the specified table rows for consistency with the "aligned" style.
 *
 * @param {readonly string[]} lines File/string lines.
 * @param {MicromarkToken[]} rows Micromark row tokens.
 * @param {string} detail Detail message.
 * @returns {RuleOnErrorInfo[]} List of errors.
 */
function checkStyleAligned(lines, rows, detail) {
  /** @type {RuleOnErrorInfo[]} */
  const errorInfos = [];
  const headerRow = rows[0];
  const headerDividerColumns = getTableDividerColumns(lines, headerRow);
  for (const row of rows.slice(1)) {
    const remainingHeaderDividerColumns = new Set(headerDividerColumns.map((column) => column.effective));
    const rowDividerColumns = getTableDividerColumns(lines, row);
    for (const dividerColumn of rowDividerColumns) {
      if ((remainingHeaderDividerColumns.size > 0) && !remainingHeaderDividerColumns.delete(dividerColumn.effective)) {
        addError(errorInfos, row.startLine, dividerColumn.actual, detail);
      }
    }
  }
  return errorInfos;
}

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD060", "table-column-style" ],
  "description": "Table column style",
  "tags": [ "table" ],
  "parser": "micromark",
  "function": function MD060(params, onError) {
    const style = String(params.config.style || "any");
    const styleAlignedAllowed = (style === "any") || (style === "aligned");
    const styleCompactAllowed = (style === "any") || (style === "compact");
    const styleTightAllowed = (style === "any") || (style === "tight");
    const alignedDelimiter = !!params.config.aligned_delimiter;
    const lines = params.lines;

    // Scan all tables/rows
    const tables = filterByTypesCached([ "table" ]);
    for (const table of tables) {
      const rows = filterByTypes(table.children, [ "tableDelimiterRow", "tableRow" ]);

      // Determine errors for style "aligned"
      /** @type {RuleOnErrorInfo[]} */
      const errorsIfAligned = [];
      if (styleAlignedAllowed) {
        errorsIfAligned.push(...checkStyleAligned(lines, rows, "Table pipe does not align with header for style \"aligned\""));
      }

      // Determine errors for styles "compact" and "tight"
      /** @type {RuleOnErrorInfo[]} */
      const errorsIfCompact = [];
      /** @type {RuleOnErrorInfo[]} */
      const errorsIfTight = [];
      if (
        (styleCompactAllowed || styleTightAllowed) &&
        !(styleAlignedAllowed && (errorsIfAligned.length === 0))
      ) {
        if (alignedDelimiter) {
          const errorInfos = checkStyleAligned(lines, rows.slice(0, 2), "Table pipe does not align with header for option \"aligned_delimiter\"");
          errorsIfCompact.push(...errorInfos);
          errorsIfTight.push(...errorInfos);
        }
        for (const row of rows) {
          const tokensOfInterest = filterByTypes(row.children, [ "tableCellDivider", "tableContent", "whitespace" ]);
          for (let i = 0; i < tokensOfInterest.length; i++) {
            const { startColumn, startLine, type } = tokensOfInterest[i];
            if (type === "tableCellDivider") {
              const previous = tokensOfInterest[i - 1];
              if (previous) {
                if (previous.type === "whitespace") {
                  if (previous.text.length !== 1) {
                    addError(
                      errorsIfCompact,
                      startLine,
                      startColumn,
                      "Table pipe has extra space to the left for style \"compact\"",
                      { "editColumn": previous.startColumn, "deleteCount": previous.text.length - 1 }
                    );
                  }
                  addError(
                    errorsIfTight,
                    startLine,
                    startColumn,
                    "Table pipe has space to the left for style \"tight\"",
                    { "editColumn": previous.startColumn, "deleteCount": previous.text.length }
                  );
                } else {
                  addError(
                    errorsIfCompact,
                    startLine,
                    startColumn,
                    "Table pipe is missing space to the left for style \"compact\"",
                    { "editColumn": previous.endColumn, "insertText": " " }
                  );
                }
              }
              const next = tokensOfInterest[i + 1];
              if (next) {
                if (next.type === "whitespace") {
                  if (next.endColumn !== row.endColumn) {
                    if (next.text.length !== 1) {
                      addError(
                        errorsIfCompact,
                        startLine,
                        startColumn,
                        "Table pipe has extra space to the right for style \"compact\"",
                        { "editColumn": next.startColumn, "deleteCount": next.text.length - 1 }
                      );
                    }
                    addError(
                      errorsIfTight,
                      startLine,
                      startColumn,
                      "Table pipe has space to the right for style \"tight\"",
                      { "editColumn": next.startColumn, "deleteCount": next.text.length }
                    );
                  }
                } else {
                  addError(
                    errorsIfCompact,
                    startLine,
                    startColumn,
                    "Table pipe is missing space to the right for style \"compact\"",
                    { "editColumn": next.startColumn, "insertText": " " }
                  );
                }
              }
            }
          }
        }
      }

      // Report errors for whatever (allowed) style has the fewest
      let errorInfos = errorsIfAligned;
      if (
        styleCompactAllowed &&
        (!styleAlignedAllowed || (errorsIfCompact.length < errorInfos.length))
      ) {
        errorInfos = errorsIfCompact;
      }
      if (
        styleTightAllowed &&
        ((errorsIfTight.length < errorInfos.length) || (!styleAlignedAllowed && !styleCompactAllowed))
      ) {
        errorInfos = errorsIfTight;
      }
      for (const errorInfo of errorInfos) {
        onError(errorInfo);
      }
    }
  }
};

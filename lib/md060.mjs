// @ts-check

import { filterByTypes } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

/** @typedef {import("micromark-extension-gfm-table")} */
/** @typedef {import("markdownlint").RuleOnErrorInfo} RuleOnErrorInfo */

/**
 * Adds a RuleOnErrorInfo object to a list of RuleOnErrorInfo objects.
 *
 * @param {RuleOnErrorInfo[]} errors List of errors.
 * @param {number} lineNumber Line number.
 * @param {number} column Column number.
 * @param {string} detail Detail message.
 */
function addError(errors, lineNumber, column, detail) {
  errors.push({
    lineNumber,
    detail,
    "range": [ column, 1 ]
  });
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

    // Scan all tables/rows
    const tables = filterByTypesCached([ "table" ]);
    for (const table of tables) {
      const rows = filterByTypes(table.children, [ "tableDelimiterRow", "tableRow" ]);
      const headingRow = rows[0];

      // Determine errors for style "aligned"
      /** @type {RuleOnErrorInfo[]} */
      const errorsIfAligned = [];
      if (styleAlignedAllowed) {
        const headingDividerColumns = filterByTypes(headingRow.children, [ "tableCellDivider" ]).map((divider) => divider.startColumn);
        for (const row of rows.slice(1)) {
          const remainingHeadingDividerColumns = new Set(headingDividerColumns);
          const rowDividerColumns = filterByTypes(row.children, [ "tableCellDivider" ]).map((divider) => divider.startColumn);
          for (const dividerColumn of rowDividerColumns) {
            if ((remainingHeadingDividerColumns.size > 0) && !remainingHeadingDividerColumns.delete(dividerColumn)) {
              addError(errorsIfAligned, row.startLine, dividerColumn, "Table pipe does not align with heading for style \"aligned\"");
            }
          }
        }
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
        for (const row of rows) {
          const tokensOfInterest = filterByTypes(row.children, [ "tableCellDivider", "tableContent", "whitespace" ]);
          for (let i = 0; i < tokensOfInterest.length; i++) {
            const { startColumn, startLine, type } = tokensOfInterest[i];
            if (type === "tableCellDivider") {
              const previous = tokensOfInterest[i - 1];
              if (previous) {
                if (previous.type === "whitespace") {
                  if (previous.text.length !== 1) {
                    addError(errorsIfCompact, startLine, startColumn, "Table pipe has extra space to the left for style \"compact\"");
                  }
                  addError(errorsIfTight, startLine, startColumn, "Table pipe has space to the left for style \"tight\"");
                } else {
                  addError(errorsIfCompact, startLine, startColumn, "Table pipe is missing space to the left for style \"compact\"");
                }
              }
              const next = tokensOfInterest[i + 1];
              if (next) {
                if (next.type === "whitespace") {
                  if (next.endColumn !== row.endColumn) {
                    if (next.text.length !== 1) {
                      addError(errorsIfCompact, startLine, startColumn, "Table pipe has extra space to the right for style \"compact\"");
                    }
                    addError(errorsIfTight, startLine, startColumn, "Table pipe has space to the right for style \"tight\"");
                  }
                } else {
                  addError(errorsIfCompact, startLine, startColumn, "Table pipe is missing space to the right for style \"compact\"");
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
        ((errorsIfCompact.length < errorInfos.length) || !styleAlignedAllowed)
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

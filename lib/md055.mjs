// @ts-check

import { addErrorDetailIf } from "../helpers/helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

/** @typedef {import("markdownlint").MicromarkToken} MicromarkToken */
/** @typedef {import("micromark-extension-gfm-table")} */

const whitespaceTypes = new Set([ "linePrefix", "whitespace" ]);
const ignoreWhitespace = (/** @type {MicromarkToken[]} */ tokens) => tokens.filter(
  (token) => !whitespaceTypes.has(token.type)
);
const fromLeft = (/** @type {MicromarkToken[]} */ items, /** @type {number} */ position) => items[position - 1];
const fromRight = (/** @type {MicromarkToken[]} */ items, /** @type {number} */ position) => items[items.length - position];

const makeRange = (/** @type {number} */ start, /** @type {number} */ end) => [ start, end - start + 1 ];

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD055", "table-pipe-style" ],
  "description": "Table pipe style",
  "tags": [ "table" ],
  "parser": "micromark",
  "function": function MD055(params, onError) {
    const style = String(params.config.style || "consistent");
    let expectedStyle = style;
    let expectedLeadingPipe =
      ((expectedStyle !== "no_leading_or_trailing") && (expectedStyle !== "trailing_only"));
    let expectedTrailingPipe =
      ((expectedStyle !== "no_leading_or_trailing") && (expectedStyle !== "leading_only"));
    const rows = filterByTypesCached([ "tableDelimiterRow", "tableRow" ]);
    for (const row of rows) {
      // The following uses of fromLeft/Right lack fallback handling
      // because it seems not to be possible (i.e., 0% coverage)
      const firstCell = fromLeft(row.children, 1);
      const leadingToken = fromLeft(ignoreWhitespace(firstCell.children), 1);
      const actualLeadingPipe = (leadingToken.type === "tableCellDivider");
      const secondToken = fromLeft(ignoreWhitespace(firstCell.children), 2);
      const lastCell = fromRight(row.children, 1);
      const trailingToken = fromRight(ignoreWhitespace(lastCell.children), 1);
      const actualTrailingPipe = (trailingToken.type === "tableCellDivider");
      const penultimateToken = fromLeft(ignoreWhitespace(lastCell.children), 2);
      const actualStyle = actualLeadingPipe ?
        (actualTrailingPipe ? "leading_and_trailing" : "leading_only") :
        (actualTrailingPipe ? "trailing_only" : "no_leading_or_trailing");
      if (expectedStyle === "consistent") {
        expectedStyle = actualStyle;
        expectedLeadingPipe = actualLeadingPipe;
        expectedTrailingPipe = actualTrailingPipe;
      }
      if (actualLeadingPipe !== expectedLeadingPipe) {
        const fix = actualLeadingPipe ?
          {
            "editColumn": leadingToken.startColumn,
            // deleting to the start of the second token removes any leading whitespace in the cell
            "deleteCount": secondToken.startColumn - leadingToken.startColumn
          } :
          {
            "editColumn": leadingToken.startColumn,
            "insertText": "|"
          };

        addErrorDetailIf(
          onError,
          firstCell.startLine,
          expectedStyle,
          actualStyle,
          `${expectedLeadingPipe ? "Missing" : "Unexpected"} leading pipe`,
          undefined,
          makeRange(row.startColumn, firstCell.startColumn),
          fix
        );
      }
      if (actualTrailingPipe !== expectedTrailingPipe) {
        const fix = actualTrailingPipe ?
          {
            "editColumn": penultimateToken.endColumn,
            // deleteing from the end of the penultimateToken removes any trailing whitespace
            "deleteCount": trailingToken.endColumn - penultimateToken.endColumn
          } :
          {
            "editColumn": trailingToken.endColumn,
            "insertText": "|"
          };
        addErrorDetailIf(
          onError,
          lastCell.endLine,
          expectedStyle,
          actualStyle,
          `${expectedTrailingPipe ? "Missing" : "Unexpected"} trailing pipe`,
          undefined,
          makeRange(lastCell.endColumn - 1, row.endColumn - 1),
          fix
        );
      }
    }
  }
};

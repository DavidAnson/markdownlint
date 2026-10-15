// @ts-check

import { addErrorDetailIf } from "../helpers/helpers.cjs";
import { getDescendantsByType } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

const listStyleExamples = {
  "one": "1/1/1",
  "ordered": "1/2/3",
  "zero": "0/0/0"
};
const listStyles = Object.keys(listStyleExamples);

/**
 * Gets the column and text of an ordered list item prefix token.
 *
 * @param {import("markdownlint").MicromarkToken} listItemPrefix List item prefix token.
 * @returns {{startColumn: number, endColumn: number, text: string, number: number}} List item value column and text.
 */
function getOrderedListItemValue(listItemPrefix) {
  const { startColumn, endColumn, text } = getDescendantsByType(listItemPrefix, [ "listItemValue" ])[0];
  return {
    startColumn,
    endColumn,
    text,
    "number": Number(text)
  };
}

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD029", "ol-prefix" ],
  "description": "Ordered list item prefix",
  "tags": [ "ol" ],
  "parser": "micromark",
  "function": function MD029(params, onError) {
    const style = String(params.config.style);
    for (const listOrdered of filterByTypesCached([ "listOrdered" ])) {
      const listItemPrefixes = getDescendantsByType(listOrdered, [ "listItemPrefix" ]);
      let expectedNumber = 1;
      let incrementing = false;
      let rightAligned = false;
      let zeroPrefixed = false;
      if (listItemPrefixes.length > 0) {
        // Check for right alignment
        const firstPrefixEndColumn = listItemPrefixes[0].endColumn;
        rightAligned = listItemPrefixes.every((prefix) => prefix.endColumn === firstPrefixEndColumn);
        if (listItemPrefixes.length > 1) {
          // Check for incrementing number pattern 1/2/3 or 0/1/2
          const firstValue = getOrderedListItemValue(listItemPrefixes[0]);
          const secondValue = getOrderedListItemValue(listItemPrefixes[1]);
          if ((secondValue.number !== 1) || (firstValue.number === 0)) {
            incrementing = true;
            if (firstValue.number === 0) {
              expectedNumber = 0;
            }
          }
          zeroPrefixed = firstValue.text.startsWith("0");
        }
      }
      // Determine effective style
      const listStyle = listStyles.includes(style) ? style : (incrementing ? "ordered" : "one");
      if (listStyle === "zero") {
        expectedNumber = 0;
      } else if (listStyle === "one") {
        expectedNumber = 1;
      }
      // Validate each list item marker
      for (const listItemPrefix of listItemPrefixes) {
        const expectedText = expectedNumber.toString();
        const { endColumn, startColumn, "number": actualNumber } = getOrderedListItemValue(listItemPrefix);
        const length = endColumn - startColumn;
        const fixInfo = {
          "editColumn": startColumn,
          "deleteCount": length,
          "insertText": rightAligned ? expectedText.padStart(length, (zeroPrefixed ? "0" : " ")) : expectedText
        };
        addErrorDetailIf(
          onError,
          listItemPrefix.startLine,
          expectedNumber,
          actualNumber,
          // @ts-ignore
          "Style: " + listStyleExamples[listStyle],
          undefined,
          [ listItemPrefix.startColumn, listItemPrefix.endColumn - listItemPrefix.startColumn ],
          fixInfo
        );
        if (listStyle === "ordered") {
          expectedNumber++;
        }
      }
    }
  }
};

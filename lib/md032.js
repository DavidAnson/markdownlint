// @ts-check

"use strict";

const { addErrorContext, isBlankLine } = require("../helpers");
const { filterByPredicate, getBlockQuotePrefixText, nonContentTokens } = require("../helpers/micromark-helpers.cjs");
const { filterByTypesCached } = require("./cache");

const isList = (token) => (
  (token.type === "listOrdered") || (token.type === "listUnordered")
);

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "parser": "micromark",
  "function": function MD032(params, onError) {
    const { lines, parsers } = params;
    const blockQuotePrefixes = filterByTypesCached([ "blockQuotePrefix", "linePrefix" ]);

    // For every top-level list...
    const topLevelLists = filterByPredicate(
      parsers.micromark.tokens,
      isList,
      (token) => (
        (isList(token) || (token.type === "htmlFlow")) ? [] : token.children
      )
    );
    for (const list of topLevelLists) {

      // Look for a blank line above the list
      const firstLineNumber = list.startLine;
      if (!isBlankLine(lines[firstLineNumber - 2])) {
        addErrorContext(
          onError,
          firstLineNumber,
          lines[firstLineNumber - 1].trim(),
          undefined,
          undefined,
          undefined,
          {
            "insertText": getBlockQuotePrefixText(blockQuotePrefixes, firstLineNumber)
          }
        );
      }

      // Find the "visual" end of the list
      let endLine = list.endLine;
      const flattenedChildren = filterByPredicate(list.children);
      for (const child of flattenedChildren.reverse()) {
        if (!nonContentTokens.has(child.type)) {
          endLine = child.endLine;
          break;
        }
      }

      // Look for a blank line below the list
      const lastLineNumber = endLine;
      if (!isBlankLine(lines[lastLineNumber])) {
        addErrorContext(
          onError,
          lastLineNumber,
          lines[lastLineNumber - 1].trim(),
          undefined,
          undefined,
          undefined,
          {
            "lineNumber": lastLineNumber + 1,
            "insertText": getBlockQuotePrefixText(blockQuotePrefixes, lastLineNumber)
          }
        );
      }
    }
  }
};

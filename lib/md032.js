// @ts-check

"use strict";

const { addErrorContext, blockquotePrefixRe, isBlankLine } = require("../helpers");
const { filterByPredicate, nonContentTokens } = require("../helpers/micromark.cjs");

const isList = (token) => (
  (token.type === "listOrdered") || (token.type === "listUnordered")
);
const addBlankLineError = (onError, lines, lineIndex, lineNumber) => {
  const line = lines[lineIndex];
  const quotePrefix = line.match(blockquotePrefixRe)[0].trimEnd();
  addErrorContext(
    onError,
    lineIndex + 1,
    line.trim(),
    null,
    null,
    null,
    {
      lineNumber,
      "insertText": `${quotePrefix}\n`
    }
  );
};

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "parser": "micromark",
  "function": function MD032(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const { lines } = params;

    // For every top-level list...
    const topLevelLists = filterByPredicate(
      micromarkTokens,
      isList,
      (token) => (
        (isList(token) || (token.type === "htmlFlow")) ? [] : token.children
      )
    );
    for (const list of topLevelLists) {

      // Look for a blank line above the list
      const firstIndex = list.startLine - 1;
      if (!isBlankLine(lines[firstIndex - 1])) {
        addBlankLineError(onError, lines, firstIndex);
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
      const lastIndex = endLine - 1;
      if (!isBlankLine(lines[lastIndex + 1])) {
        addBlankLineError(onError, lines, lastIndex, lastIndex + 2);
      }
    }
  }
};

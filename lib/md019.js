// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes, getHeadingStyle } = require("../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD019", "no-multiple-space-atx" ],
  "description": "Multiple spaces after hash on atx style heading",
  "tags": [ "headings", "atx", "spaces" ],
  "parser": "micromark",
  "function": function MD019(params, onError) {
    const atxHeadings = filterByTypes(
      params.parsers.micromark.tokens,
      [ "atxHeading" ]
    ).filter((heading) => getHeadingStyle(heading) === "atx");
    for (const atxHeading of atxHeadings) {
      const [ atxHeadingSequence, whitespace ] = atxHeading.children;
      if (
        (atxHeadingSequence?.type === "atxHeadingSequence") &&
        (whitespace?.type === "whitespace") &&
        (whitespace.text.length > 1)
      ) {
        const column = whitespace.startColumn + 1;
        const length = whitespace.endColumn - column;
        addErrorContext(
          onError,
          atxHeading.startLine,
          atxHeading.text.trim(),
          true,
          false,
          [ column, length ],
          {
            "editColumn": column,
            "deleteCount": length
          }
        );
      }
    }
  }
};

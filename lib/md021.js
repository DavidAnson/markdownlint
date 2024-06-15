// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes, getHeadingStyle } = require("../helpers/micromark.cjs");
  
// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD021", "no-multiple-space-closed-atx" ],
  "description": "Multiple spaces inside hashes on closed atx style heading",
  "tags": [ "headings", "atx_closed", "spaces" ],
  "parser": "micromark",
  "function": function MD021(params, onError) {
    const atxHeadings = filterByTypes(
      params.parsers.micromark.tokens,
      [ "atxHeading" ]
    ).filter((heading) => getHeadingStyle(heading) === "atx_closed");
    for (const atxHeading of atxHeadings) {
      const [ atxHeadingSequenceStart, whitespaceStart ] = atxHeading.children;
      if (
        (atxHeadingSequenceStart?.type === "atxHeadingSequence") &&
        (whitespaceStart?.type === "whitespace") &&
        (whitespaceStart.text.length > 1)
      ) {
        const column = whitespaceStart.startColumn + 1;
        const length = whitespaceStart.endColumn - column;
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
      let endSequenceIndex = atxHeading.children.length - 1;
      while (
        (endSequenceIndex > 1) &&
        (atxHeading.children[endSequenceIndex].type !== "atxHeadingSequence")
      ) {
        endSequenceIndex--;
      }
      const atxHeadingSequenceEnd = atxHeading.children.at(endSequenceIndex);
      const whitespaceEnd = atxHeading.children.at(endSequenceIndex - 1);
      if (
        (atxHeadingSequenceEnd?.type === "atxHeadingSequence") &&
        (whitespaceEnd?.type === "whitespace") &&
        (whitespaceEnd.text.length > 1)
      ) {
        const column = whitespaceEnd.startColumn + 1;
        const length = whitespaceEnd.endColumn - column;
        addErrorContext(
          onError,
          atxHeading.startLine,
          atxHeading.text.trim(),
          false,
          true,
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

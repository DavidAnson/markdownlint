// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes, getHeadingLevel, getHeadingText } = require("../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD024", "no-duplicate-heading" ],
  "description": "Multiple headings with the same content",
  "tags": [ "headings" ],
  "parser": "micromark",
  "function": function MD024(params, onError) {
    const siblingsOnly = !!params.config.siblings_only || false;
    const knownContents = [ null, [] ];
    let lastLevel = 1;
    let knownContent = knownContents[lastLevel];
    const headings = filterByTypes(
      params.parsers.micromark.tokens,
      [ "atxHeading", "setextHeading" ]
    );
    for (const heading of headings) {
      const headingText = getHeadingText(heading);
      if (siblingsOnly) {
        const newLevel = getHeadingLevel(heading);
        while (lastLevel < newLevel) {
          lastLevel++;
          knownContents[lastLevel] = [];
        }
        while (lastLevel > newLevel) {
          knownContents[lastLevel] = [];
          lastLevel--;
        }
        knownContent = knownContents[newLevel];
      }
      // @ts-ignore
      if (knownContent.includes(headingText)) {
        addErrorContext(
          onError,
          heading.startLine,
          headingText.trim()
        );
      } else {
        // @ts-ignore
        knownContent.push(headingText);
      }
    }
  }
};

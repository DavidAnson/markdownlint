// @ts-check

"use strict";

const { addErrorContext, frontMatterHasTitle } = require("../helpers");
const { filterByTypes, getHeadingLevel, inHtmlFlow } =
  require("../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD025", "single-title", "single-h1" ],
  "description": "Multiple top-level headings in the same document",
  "tags": [ "headings" ],
  "parser": "micromark",
  "function": function MD025(params, onError) {
    const level = Number(params.config.level || 1);
    const foundFrontMatterTitle =
      frontMatterHasTitle(
        params.frontMatterLines,
        params.config.front_matter_title
      );
    let hasTopLevelHeading = false;
    const headings = filterByTypes(
      params.parsers.micromark.tokens,
      [ "atxHeading", "setextHeading" ]
    );
    for (const heading of headings) {
      const headingLevel = getHeadingLevel(heading);
      if ((headingLevel === level) && !inHtmlFlow(heading)) {
        if (hasTopLevelHeading || foundFrontMatterTitle) {
          const headingTexts = filterByTypes(
            heading.children,
            [ "atxHeadingText", "setextHeadingText" ]
          );
          const headingText = headingTexts.
            map((token) => token.text).
            join(" ").
            replace(/[\r\n]+/g, " ");
          addErrorContext(
            onError,
            heading.startLine,
            headingText
          );
        } else if (heading.startLine === 1) {
          hasTopLevelHeading = true;
        }
      }
    }
  }
};

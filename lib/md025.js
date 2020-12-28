// @ts-check

"use strict";

const { addErrorContext, filterTokens, frontMatterHasTitle } =
  require("../helpers");

module.exports = {
  "names": [ "MD025", "single-title", "single-h1" ],
  "description": "Multiple top-level headings in the same document",
  "tags": [ "headings", "headers" ],
  "function": function MD025(params, onError) {
    const level = Number(params.config.level || 1);
    const tag = "h" + level;
    const foundFrontMatterTitle =
      frontMatterHasTitle(
        params.frontMatterLines,
        params.config.front_matter_title
      );
    let hasTopLevelHeading = false;
    filterTokens(params, "heading_open", function forToken(token) {
      if (token.tag === tag) {
        if (hasTopLevelHeading || foundFrontMatterTitle) {
          addErrorContext(onError, token.lineNumber,
            token.line.trim());
        } else if (token.lineNumber === 1) {
          hasTopLevelHeading = true;
        }
      }
    });
  }
};

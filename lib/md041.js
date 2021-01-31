// @ts-check

"use strict";

const { addErrorContext, frontMatterHasTitle } = require("../helpers");

module.exports = {
  "names": [ "MD041", "first-line-heading", "first-line-h1" ],
  "description": "First line in a file should be a top-level heading",
  "tags": [ "headings", "headers" ],
  "function": function MD041(params, onError) {
    const level = Number(params.config.level || 1);
    const tag = "h" + level;
    const foundFrontMatterTitle =
      frontMatterHasTitle(
        params.frontMatterLines,
        params.config.front_matter_title
      );
    if (!foundFrontMatterTitle) {
      const htmlHeadingRe = new RegExp(`^<h${level}[ />]`, "i");
      params.tokens.every((token) => {
        let isError = false;
        if (token.type === "html_block") {
          if (token.content.startsWith("<!--")) {
            // Ignore leading HTML comments
            return true;
          } else if (!htmlHeadingRe.test(token.content)) {
            // Something other than an HTML heading
            isError = true;
          }
        } else if ((token.type !== "heading_open") || (token.tag !== tag)) {
          // Something other than a Markdown heading
          isError = true;
        }
        if (isError) {
          addErrorContext(onError, token.lineNumber, token.line);
        }
        return false;
      });
    }
  }
};

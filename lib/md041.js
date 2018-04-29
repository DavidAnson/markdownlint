// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD041", "first-line-h1" ],
  "description": "First line in file should be a top level heading",
  "tags": [ "headings", "headers" ],
  "function": function MD041(params, onError) {
    const level = params.config.level || 1;
    const frontMatterTitle = params.config.front_matter_title;
    const tag = "h" + level;
    const frontMatterTitleRe =
      new RegExp(frontMatterTitle || "^\\s*title\\s*[:=]", "i");
    params.tokens.every(function forToken(token) {
      if (token.type === "html_block") {
        return true;
      } else if (token.type === "heading_open") {
        if (token.tag !== tag) {
          shared.addErrorContext(onError, token.lineNumber, token.line);
        }
      } else if (((frontMatterTitle !== undefined) && !frontMatterTitle) ||
        !params.frontMatterLines.some(function forLine(line) {
          return frontMatterTitleRe.test(line);
        })) {
        shared.addErrorContext(onError, token.lineNumber, token.line);
      }
      return false;
    });
  }
};

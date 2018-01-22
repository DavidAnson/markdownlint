// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD041", "first-line-h1" ],
  "description": "First line in file should be a top level header",
  "tags": [ "headers" ],
  "function": function MD041(params, onError) {
    var level = params.config.level || 1;
    var frontMatterTitle = params.config.front_matter_title;
    var tag = "h" + level;
    var frontMatterTitleRe =
      new RegExp(frontMatterTitle || "^\\s*title\\s*[:=]", "i");
    params.tokens.every(function forToken(token, index) {
      if (token.type === "heading_open") {
        if (!((token.lineNumber === 1) || (index > 0)) ||
            (token.tag !== tag)) {
          shared.addErrorContext(onError, token.lineNumber, token.line);
        }
        return false;
      } else if (token.type === "html_block") {
        return true;
      }
      if (((frontMatterTitle !== undefined) && !frontMatterTitle) ||
        !params.frontMatterLines.some(function forLine(line) {
          return frontMatterTitleRe.test(line);
        })) {
        shared.addErrorContext(onError, token.lineNumber, token.line);
      }
      return false;
    });
  }
};

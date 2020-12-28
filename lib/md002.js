// @ts-check

"use strict";

const { addErrorDetailIf } = require("../helpers");

module.exports = {
  "names": [ "MD002", "first-heading-h1", "first-header-h1" ],
  "description": "First heading should be a top-level heading",
  "tags": [ "headings", "headers" ],
  "function": function MD002(params, onError) {
    const level = Number(params.config.level || 1);
    const tag = "h" + level;
    params.tokens.every(function forToken(token) {
      if (token.type === "heading_open") {
        addErrorDetailIf(onError, token.lineNumber, tag, token.tag);
        return false;
      }
      return true;
    });
  }
};

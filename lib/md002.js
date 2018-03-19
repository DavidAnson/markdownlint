// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD002", "first-heading-h1", "first-header-h1" ],
  "description": "First heading should be a top level heading",
  "tags": [ "headings", "headers" ],
  "function": function MD002(params, onError) {
    var level = params.config.level || 1;
    var tag = "h" + level;
    params.tokens.every(function forToken(token) {
      if (token.type === "heading_open") {
        shared.addErrorDetailIf(onError, token.lineNumber, tag, token.tag);
        return false;
      }
      return true;
    });
  }
};

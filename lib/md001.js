// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD001", "header-increment" ],
  "description": "Header levels should only increment by one level at a time",
  "tags": [ "headers" ],
  "function": function MD001(params, onError) {
    var prevLevel = 0;
    shared.filterTokens(params, "heading_open", function forToken(token) {
      var level = parseInt(token.tag.slice(1), 10);
      if (prevLevel && (level > prevLevel)) {
        shared.addErrorDetailIf(onError, token.lineNumber,
          "h" + (prevLevel + 1), "h" + level);
      }
      prevLevel = level;
    });
  }
};

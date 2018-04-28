// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD035", "hr-style" ],
  "description": "Horizontal rule style",
  "tags": [ "hr" ],
  "function": function MD035(params, onError) {
    let style = params.config.style || "consistent";
    shared.filterTokens(params, "hr", function forToken(token) {
      const lineTrim = token.line.trim();
      if (style === "consistent") {
        style = lineTrim;
      }
      shared.addErrorDetailIf(onError, token.lineNumber, style, lineTrim);
    });
  }
};

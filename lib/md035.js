// @ts-check

"use strict";

const { addErrorDetailIf, filterTokens } = require("../helpers");

module.exports = {
  "names": [ "MD035", "hr-style" ],
  "description": "Horizontal rule style",
  "tags": [ "hr" ],
  "function": function MD035(params, onError) {
    let style = String(params.config.style || "consistent");
    filterTokens(params, "hr", function forToken(token) {
      const lineTrim = token.line.trim();
      if (style === "consistent") {
        style = lineTrim;
      }
      addErrorDetailIf(onError, token.lineNumber, style, lineTrim);
    });
  }
};

// @ts-check

"use strict";

const { addErrorDetailIf, filterTokens } = require("../helpers");

module.exports = {
  "names": [ "MD035", "hr-style" ],
  "description": "Horizontal rule style",
  "tags": [ "hr" ],
  "function": function MD035(params, onError) {
    let style = String(params.config.style || "consistent").trim();
    filterTokens(params, "hr", (token) => {
      const { line, lineNumber } = token;
      let { markup } = token;
      const match = line.match(/[_*\-\s\t]+$/);
      if (match) {
        markup = match[0].trim();
      }
      if (style === "consistent") {
        style = markup;
      }
      addErrorDetailIf(onError, lineNumber, style, markup);
    });
  }
};

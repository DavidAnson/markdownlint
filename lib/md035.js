// @ts-check

"use strict";

const { addErrorDetailIf } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD035", "hr-style" ],
  "description": "Horizontal rule style",
  "tags": [ "hr" ],
  "function": function MD035(params, onError) {
    let style = String(params.config.style || "consistent").trim();
    const thematicBreaks =
      // eslint-disable-next-line dot-notation
      filterByTypes(params.parsers["micromark"].tokens, [ "thematicBreak" ]);
    for (const token of thematicBreaks) {
      const { startLine, text } = token;
      if (style === "consistent") {
        style = text;
      }
      addErrorDetailIf(onError, startLine, style, text);
    }
  }
};

// @ts-check

"use strict";

const { addErrorDetailIf, emphasisOrStrongStyleFor, forEachInlineChild } =
  require("../helpers");

module.exports = {
  "names": [ "MD050", "strong-style" ],
  "description": "Strong style should be consistent",
  "tags": [ "emphasis" ],
  "function": function MD050(params, onError) {
    let expectedStyle = String(params.config.style || "consistent");
    forEachInlineChild(params, "strong_open", (token) => {
      const { lineNumber, markup } = token;
      const markupStyle = emphasisOrStrongStyleFor(markup);
      if (expectedStyle === "consistent") {
        expectedStyle = markupStyle;
      }
      addErrorDetailIf(
        onError,
        lineNumber,
        expectedStyle,
        markupStyle
      );
    });
  }
};

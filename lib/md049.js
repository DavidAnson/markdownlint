// @ts-check

"use strict";

const { addErrorDetailIf, emphasisOrStrongStyleFor, forEachInlineChild } =
  require("../helpers");

module.exports = {
  "names": [ "MD049", "emphasis-style" ],
  "description": "Emphasis style should be consistent",
  "tags": [ "emphasis" ],
  "function": function MD049(params, onError) {
    let expectedStyle = String(params.config.style || "consistent");
    forEachInlineChild(params, "em_open", (token) => {
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

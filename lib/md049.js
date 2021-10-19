// @ts-check

"use strict";

const { addErrorDetailIf, strongEmphasisStyleFor, forEachInlineChild } =
                                                          require("../helpers");

module.exports = {
  "names": [ "MD049", "strong-style" ],
  "description": "Strong style should be consistent",
  "tags": [ "emphasis" ],
  "function": function MD049(params, onError) {
    let expectedStyle = String(params.config.style || "consistent");
    forEachInlineChild(params, "strong_open", (token) => {
      const { lineNumber, markup } = token;
      if (expectedStyle === "consistent") {
        expectedStyle = strongEmphasisStyleFor(markup);
      }
      addErrorDetailIf(
        onError,
        lineNumber,
        expectedStyle,
        strongEmphasisStyleFor(markup)
      );
    });
  }
};

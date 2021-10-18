// @ts-check

"use strict";

const { addErrorDetailIf, emphasisStyleFor } = require("../helpers");

module.exports = {
  "names": [ "MD049", "emphasis-strong-style" ],
  "description": "Emphasis strong style",
  "tags": [ "emphasis" ],
  "function": function MD049(params, onError) {
    const style = String(params.config.style || "consistent");
    let expectedStyle = style;
    params.tokens
      .filter((token) => token.type === "inline")
      .forEach((inlineToken) => {
        inlineToken.children
          .filter((child) => child.type === "strong_open")
          .forEach((strongToken) => {
            const { lineNumber, markup } = strongToken;
            if (expectedStyle === "consistent") {
              expectedStyle = emphasisStyleFor(markup);
            }
            addErrorDetailIf(
              onError,
              lineNumber,
              expectedStyle,
              emphasisStyleFor(markup)
            );
          });
      });
  }
};

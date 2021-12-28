// @ts-check

"use strict";

const { addError, emphasisOrStrongStyleFor, forEachInlineChild,
  getNextChildToken, getRangeAndFixInfoIfFound } = require("../helpers");

module.exports = {
  "names": [ "MD050", "strong-style" ],
  "description": "Strong style should be consistent",
  "tags": [ "emphasis" ],
  "function": function MD050(params, onError) {
    let expectedStyle = String(params.config.style || "consistent");
    forEachInlineChild(params, "strong_open", (token, parent) => {
      const { lineNumber, markup } = token;
      const markupStyle = emphasisOrStrongStyleFor(markup);
      if (expectedStyle === "consistent") {
        expectedStyle = markupStyle;
      }
      if (expectedStyle !== markupStyle) {
        let rangeAndFixInfo = {};
        const contentToken = getNextChildToken(
          parent, token, "text", "strong_close"
        );
        if (contentToken) {
          const { content } = contentToken;
          const actual = `${markup}${content}${markup}`;
          const expectedMarkup = (expectedStyle === "asterisk") ? "**" : "__";
          const expected = `${expectedMarkup}${content}${expectedMarkup}`;
          rangeAndFixInfo = getRangeAndFixInfoIfFound(
            params.lines, lineNumber - 1, actual, expected
          );
        }
        addError(
          onError,
          lineNumber,
          `Expected: ${expectedStyle}; Actual: ${markupStyle}`,
          null,
          rangeAndFixInfo.range,
          rangeAndFixInfo.fixInfo
        );
      }
    });
  }
};

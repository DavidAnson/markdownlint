// @ts-check

"use strict";

const { addError, emphasisOrStrongStyleFor, forEachInlineChild,
  getNextChildToken, getRangeAndFixInfoIfFound } = require("../helpers");

const impl =
  (params, onError, tagPrefix, asterisk, underline, style = "consistent") => {
    let lastLineNumber = -1;
    const instances = new Map();
    forEachInlineChild(params, `${tagPrefix}_open`, (token, parent) => {
      const { lineNumber, markup } = token;
      const markupStyle = emphasisOrStrongStyleFor(markup);
      if (style === "consistent") {
        style = markupStyle;
      }
      if (style !== markupStyle) {
        let rangeAndFixInfo = {};
        const contentToken = getNextChildToken(
          parent, token, "text", `${tagPrefix}_close`
        );
        if (contentToken) {
          const { content } = contentToken;
          const actual = `${markup}${content}${markup}`;
          const expectedMarkup =
            (style === "asterisk") ? asterisk : underline;
          const expected = `${expectedMarkup}${content}${expectedMarkup}`;
          if (lastLineNumber !== lineNumber) {
            lastLineNumber = lineNumber;
            instances.clear();
          }
          const instance = (instances.get(expected) || 0) + 1;
          instances.set(expected, instance);
          rangeAndFixInfo = getRangeAndFixInfoIfFound(
            params.lines,
            lineNumber - 1,
            actual,
            expected,
            instance
          );
        }
        addError(
          onError,
          lineNumber,
          `Expected: ${style}; Actual: ${markupStyle}`,
          undefined,
          rangeAndFixInfo.range,
          rangeAndFixInfo.fixInfo
        );
      }
    });
  };

module.exports = [
  {
    "names": [ "MD049", "emphasis-style" ],
    "description": "Emphasis style should be consistent",
    "tags": [ "emphasis" ],
    "function": function MD049(params, onError) {
      return impl(
        params,
        onError,
        "em",
        "*",
        "_",
        params.config.style || undefined
      );
    }
  },
  {
    "names": [ "MD050", "strong-style" ],
    "description": "Strong style should be consistent",
    "tags": [ "emphasis" ],
    "function": function MD050(params, onError) {
      return impl(
        params,
        onError,
        "strong",
        "**",
        "__",
        params.config.style || undefined
      );
    }
  }
];

// @ts-check

"use strict";

const { addError, filterTokens, forEachInlineChild, newLineRe,
  rangeFromRegExp } = require("../helpers");

const htmlRe = /<[^>]*>/;

module.exports = {
  "names": [ "MD033", "no-inline-html" ],
  "description": "Inline HTML",
  "tags": [ "html" ],
  "function": function MD033(params, onError) {
    const allowedElements = (params.config.allowed_elements || [])
      .map((element) => element.toLowerCase());
    function forToken(token) {
      token.content.split(newLineRe)
        .forEach((line, offset) => {
          const allowed = (line.match(/<[^/\s>!]*/g) || [])
            .filter((element) => element.length > 1)
            .map((element) => element.slice(1).toLowerCase())
            .filter((element) => !allowedElements.includes(element));
          if (allowed.length) {
            addError(onError, token.lineNumber + offset,
              "Element: " + allowed[0], null,
              rangeFromRegExp(token.line, htmlRe));
          }
        });
    }
    filterTokens(params, "html_block", forToken);
    forEachInlineChild(params, "html_inline", forToken);
  }
};

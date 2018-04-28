// @ts-check

"use strict";

const shared = require("./shared");

const htmlRe = /<[^>]*>/;

module.exports = {
  "names": [ "MD033", "no-inline-html" ],
  "description": "Inline HTML",
  "tags": [ "html" ],
  "function": function MD033(params, onError) {
    const allowedElements = (params.config.allowed_elements || [])
      .map(function forElement(element) {
        return element.toLowerCase();
      });
    function forToken(token) {
      token.content.split(shared.newLineRe)
        .forEach(function forLine(line, offset) {
          const allowed = (line.match(/<[^/\s>!]*/g) || [])
            .filter(function forElement(element) {
              return element.length > 1;
            })
            .map(function forElement(element) {
              return element.slice(1).toLowerCase();
            })
            .filter(function forElement(element) {
              return allowedElements.indexOf(element) === -1;
            });
          if (allowed.length) {
            shared.addError(onError, token.lineNumber + offset,
              "Element: " + allowed[0], null,
              shared.rangeFromRegExp(token.line, htmlRe));
          }
        });
    }
    shared.filterTokens(params, "html_block", forToken);
    shared.forEachInlineChild(params, "html_inline", forToken);
  }
};

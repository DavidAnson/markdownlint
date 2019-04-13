// @ts-check

"use strict";

const { addError, forEachHeading, rangeFromRegExp } = require("../helpers");

module.exports = {
  "names": [ "MD026", "no-trailing-punctuation" ],
  "description": "Trailing punctuation in heading",
  "tags": [ "headings", "headers" ],
  "function": function MD026(params, onError) {
    const punctuation = params.config.punctuation || ".,;:!?";
    const trailingPunctuationRe = new RegExp("[" + punctuation + "]$");
    forEachHeading(params, function forHeading(heading, content) {
      const match = trailingPunctuationRe.exec(content);
      if (match) {
        addError(onError, heading.lineNumber,
          "Punctuation: '" + match[0] + "'", null,
          rangeFromRegExp(heading.line, trailingPunctuationRe));
      }
    });
  }
};

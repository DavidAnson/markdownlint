// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD026", "no-trailing-punctuation" ],
  "description": "Trailing punctuation in heading",
  "tags": [ "headings", "headers" ],
  "function": function MD026(params, onError) {
    const punctuation = params.config.punctuation || ".,;:!?";
    const trailingPunctuationRe = new RegExp("[" + punctuation + "]$");
    shared.forEachHeading(params, function forHeading(heading, content) {
      const match = trailingPunctuationRe.exec(content);
      if (match) {
        shared.addError(onError, heading.lineNumber,
          "Punctuation: '" + match[0] + "'", null,
          shared.rangeFromRegExp(heading.line, trailingPunctuationRe));
      }
    });
  }
};

// @ts-check

"use strict";

const { addError, allPunctuation, escapeForRegExp, forEachHeading,
  rangeFromRegExp } = require("../helpers");

module.exports = {
  "names": [ "MD026", "no-trailing-punctuation" ],
  "description": "Trailing punctuation in heading",
  "tags": [ "headings", "headers" ],
  "function": function MD026(params, onError) {
    let punctuation = params.config.punctuation;
    if (punctuation === undefined) {
      punctuation = allPunctuation;
    }
    const trailingPunctuationRe =
      new RegExp("[" + escapeForRegExp(punctuation) + "]$");
    forEachHeading(params, (heading, content) => {
      const match = trailingPunctuationRe.exec(content);
      if (match) {
        addError(onError, heading.lineNumber,
          "Punctuation: '" + match[0] + "'", null,
          rangeFromRegExp(heading.line, trailingPunctuationRe));
      }
    });
  }
};

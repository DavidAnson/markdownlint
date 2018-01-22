// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD026", "no-trailing-punctuation" ],
  "description": "Trailing punctuation in header",
  "tags": [ "headers" ],
  "function": function MD026(params, onError) {
    var punctuation = params.config.punctuation || ".,;:!?";
    var trailingPunctuationRe = new RegExp("[" + punctuation + "]$");
    shared.forEachHeading(params, function forHeading(heading, content) {
      var match = trailingPunctuationRe.exec(content);
      if (match) {
        shared.addError(onError, heading.lineNumber,
          "Punctuation: '" + match[0] + "'", null,
          shared.rangeFromRegExp(heading.line, trailingPunctuationRe));
      }
    });
  }
};

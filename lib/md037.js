// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD037", "no-space-in-emphasis" ],
  "description": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "function": function MD037(params, onError) {
    shared.forEachInlineChild(params, "text", function forToken(token) {
      var left = true;
      var match = /\s(\*\*?|__?)\s.+\1/.exec(token.content);
      if (!match) {
        left = false;
        match = /(\*\*?|__?).+\s\1\s/.exec(token.content);
      }
      if (match) {
        var text = match[0].trim();
        var line = params.lines[token.lineNumber - 1];
        var column = line.indexOf(text) + 1;
        var length = text.length;
        shared.addErrorContext(onError, token.lineNumber,
          text, left, !left, [ column, length ]);
      }
    });
  }
};

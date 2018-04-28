// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD037", "no-space-in-emphasis" ],
  "description": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "function": function MD037(params, onError) {
    shared.forEachInlineChild(params, "text", function forToken(token) {
      let left = true;
      let match = /\s(\*\*?|__?)\s.+\1/.exec(token.content);
      if (!match) {
        left = false;
        match = /(\*\*?|__?).+\s\1\s/.exec(token.content);
      }
      if (match) {
        const text = match[0].trim();
        const line = params.lines[token.lineNumber - 1];
        const column = line.indexOf(text) + 1;
        const length = text.length;
        shared.addErrorContext(onError, token.lineNumber,
          text, left, !left, [ column, length ]);
      }
    });
  }
};

// @ts-check

"use strict";

const { addErrorContext, forEachInlineChild } = require("../helpers");

module.exports = {
  "names": [ "MD037", "no-space-in-emphasis" ],
  "description": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "function": function MD037(params, onError) {
    forEachInlineChild(params, "text", (token) => {
      let left = true;
      let match = /(?:^|\s)(\*\*?|__?)\s.*[^\\]\1/.exec(token.content);
      if (!match) {
        left = false;
        match = /(?:^|[^\\])(\*\*?|__?).+\s\1(?:\s|$)/.exec(token.content);
      }
      if (match) {
        const fullText = match[0];
        const line = params.lines[token.lineNumber - 1];
        if (line.includes(fullText)) {
          const text = fullText.trim();
          const column = line.indexOf(text) + 1;
          const length = text.length;
          addErrorContext(onError, token.lineNumber,
            text, left, !left, [ column, length ]);
        }
      }
    });
  }
};

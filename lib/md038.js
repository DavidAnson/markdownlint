// @ts-check

"use strict";

const shared = require("./shared");

const inlineCodeSpansRe = /(?:^|[^\\])((`+)((?:[\s\S]*?[^`])|)\2(?!`))/g;

module.exports = {
  "names": [ "MD038", "no-space-in-code" ],
  "description": "Spaces inside code span elements",
  "tags": [ "whitespace", "code" ],
  "function": function MD038(params, onError) {
    let lastParent = null;
    shared.forEachInlineChild(params, "code_inline",
      function forToken(token, parent) {
        if (lastParent !== parent) {
          lastParent = parent;
          inlineCodeSpansRe.lastIndex = 0;
        }
        const match = inlineCodeSpansRe.exec(parent.content);
        const content = match[3];
        const leftError = /^\s([^`]|$)/.test(content);
        const rightError = /[^`]\s$/.test(content);
        if (leftError || rightError) {
          const inlineCodeSpan = match[1];
          const leftContent = parent.content.substr(0,
            match.index + (match[0].length - inlineCodeSpan.length));
          const leftContentLines = leftContent.split(shared.newLineRe);
          const inlineCodeSpanLines = inlineCodeSpan.split(shared.newLineRe);
          let range = [
            leftContentLines[leftContentLines.length - 1].length + 1,
            inlineCodeSpanLines[0].length
          ];
          if (leftError) {
            shared.addErrorContext(onError, token.lineNumber,
              inlineCodeSpan, true, false, range);
          } else {
            if (inlineCodeSpanLines.length > 1) {
              range = [
                1,
                inlineCodeSpanLines[inlineCodeSpanLines.length - 1].length
              ];
            }
            shared.addErrorContext(onError,
              token.lineNumber + content.split(shared.newLineRe).length - 1,
              inlineCodeSpan, false, true, range);
          }
        }
      });
  }
};

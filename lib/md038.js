// @ts-check

"use strict";

var shared = require("./shared");

var inlineCodeSpansRe = /(?:^|[^\\])((`+)((?:.*?[^`])|)\2(?!`))/g;

module.exports = {
  "names": [ "MD038", "no-space-in-code" ],
  "description": "Spaces inside code span elements",
  "tags": [ "whitespace", "code" ],
  "function": function MD038(params, onError) {
    shared.forEachInlineChild(params, "code_inline",
      function forToken(token) {
        var line = params.lines[token.lineNumber - 1];
        var match = null;
        while ((match = inlineCodeSpansRe.exec(line)) !== null) {
          var inlineCodeSpan = match[1];
          var content = match[3];
          var length = inlineCodeSpan.length;
          var column = match.index + 1 + (match[0].length - length);
          var range = [ column, length ];
          if (/^\s([^`]|$)/.test(content)) {
            shared.addErrorContext(onError, token.lineNumber,
              inlineCodeSpan, true, false, range);
          } else if (/[^`]\s$/.test(content)) {
            shared.addErrorContext(onError, token.lineNumber,
              inlineCodeSpan, false, true, range);
          }
        }
      });
  }
};

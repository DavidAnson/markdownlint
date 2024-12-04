// @ts-check

"use strict";

/** @type {import("markdownlint").Rule[]} */
module.exports = [

  // micromark parser (preferred)
  {
    "names": [ "any-blockquote-micromark" ],
    "description": "Rule that reports an error for any blockquote",
    "information": new URL(
      "https://github.com/DavidAnson/markdownlint/blob/main/test/rules/any-blockquote.js"
    ),
    "tags": [ "test" ],
    "parser": "micromark",
    "function": (params, onError) => {
      const blockquotes = params.parsers.micromark.tokens
        .filter((token) => token.type === "blockQuote");
      for (const blockquote of blockquotes) {
        const lines = blockquote.endLine - blockquote.startLine + 1;
        onError({
          "lineNumber": blockquote.startLine,
          "detail": "Blockquote spans " + lines + " line(s).",
          "context": params.lines[blockquote.startLine - 1]
        });
      }
    }
  },

  // markdown-it parser (legacy)
  {
    "names": [ "any-blockquote-markdown-it" ],
    "description": "Rule that reports an error for any blockquote",
    "information": new URL(
      "https://github.com/DavidAnson/markdownlint/blob/main/test/rules/any-blockquote.js"
    ),
    "tags": [ "test" ],
    "parser": "markdownit",
    "function": (params, onError) => {
      const blockquotes = params.parsers.markdownit.tokens
        .filter((token) => token.type === "blockquote_open");
      for (const blockquote of blockquotes) {
        const [ startIndex, endIndex ] = blockquote.map;
        const lines = endIndex - startIndex;
        onError({
          "lineNumber": blockquote.lineNumber,
          "detail": "Blockquote spans " + lines + " line(s).",
          "context": blockquote.line
        });
      }
    }
  }

];

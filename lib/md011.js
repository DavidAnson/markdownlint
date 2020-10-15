// @ts-check

"use strict";

const { addError, forEachInlineChild, unescapeMarkdown } =
  require("../helpers");

const reversedLinkRe = /\(([^)]+)\)\[([^\]^][^\]]*)]/g;

module.exports = {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "function": function MD011(params, onError) {
    forEachInlineChild(params, "text", (token) => {
      const { lineNumber, content } = token;
      let match = null;
      while ((match = reversedLinkRe.exec(content)) !== null) {
        const [ reversedLink, linkText, linkDestination ] = match;
        const line = params.lines[lineNumber - 1];
        const column = unescapeMarkdown(line).indexOf(reversedLink) + 1;
        const length = reversedLink.length;
        const range = column ? [ column, length ] : null;
        const fixInfo = column ?
          {
            "editColumn": column,
            "deleteCount": length,
            "insertText": `[${linkText}](${linkDestination})`
          } :
          null;
        addError(
          onError,
          lineNumber,
          reversedLink,
          null,
          range,
          fixInfo
        );
      }
    });
  }
};

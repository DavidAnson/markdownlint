// @ts-check

"use strict";

const { addError, forEachLine, overlapsAnyRange } = require("../helpers");
const { codeBlockAndSpanRanges, lineMetadata } = require("./cache");

const reversedLinkRe =
  /(^|[^\\])\(([^)]+)\)\[([^\]^][^\]]*)](?!\()/g;

module.exports = {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "function": function MD011(params, onError) {
    const exclusions = codeBlockAndSpanRanges();
    forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence) => {
      if (!inCode && !onFence) {
        let match = null;
        while ((match = reversedLinkRe.exec(line)) !== null) {
          const [ reversedLink, preChar, linkText, linkDestination ] = match;
          const index = match.index + preChar.length;
          const length = match[0].length - preChar.length;
          if (
            !linkText.endsWith("\\") &&
            !linkDestination.endsWith("\\") &&
            !overlapsAnyRange(exclusions, lineIndex, index, length)
          ) {
            addError(
              onError,
              lineIndex + 1,
              reversedLink.slice(preChar.length),
              null,
              [ index + 1, length ],
              {
                "editColumn": index + 1,
                "deleteCount": length,
                "insertText": `[${linkText}](${linkDestination})`
              }
            );
          }
        }
      }
    });
  }
};

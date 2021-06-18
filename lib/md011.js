// @ts-check

"use strict";

const { addError, forEachLine, overlapsAnyRange } = require("../helpers");
const { inlineCodeSpanRanges, lineMetadata } = require("./cache");

const reversedLinkRe =
  /(?<![\\\]])\(([^)]+)(?<!\\)\)\[([^\]^][^\]]*)(?<!\\)](?!\()/g;

module.exports = {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "function": function MD011(params, onError) {
    const exclusions = inlineCodeSpanRanges();
    forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence) => {
      if (!inCode && !onFence) {
        let match = null;
        while ((match = reversedLinkRe.exec(line)) !== null) {
          const [ reversedLink, linkText, linkDestination ] = match;
          const index = match.index;
          const length = match[0].length;
          if (!overlapsAnyRange(exclusions, lineIndex, index, length)) {
            addError(
              onError,
              lineIndex + 1,
              reversedLink,
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

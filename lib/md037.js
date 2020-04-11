// @ts-check

"use strict";

const { addErrorContext, forEachLine } = require("../helpers");
const { lineMetadata } = require("./cache");

const emphasisRe = /(^|[^\\])(?:(\*\*?\*?)|(__?_?))/g;
const asteriskListItemMarkerRe = /^(\s*)\*(\s+)/;
const leftSpaceRe = /^\s+/;
const rightSpaceRe = /\s+$/;

module.exports = {
  "names": [ "MD037", "no-space-in-emphasis" ],
  "description": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "function": function MD037(params, onError) {
    forEachLine(
      lineMetadata(),
      (line, lineIndex, inCode, onFence, inTable, inItem, inBreak) => {
        if (inCode || inBreak) {
          // Emphasis has no meaning here
          return;
        }
        if (inItem === 1) {
          // Trim overlapping '*' list item marker
          line = line.replace(asteriskListItemMarkerRe, "$1 $2");
        }
        let match = null;
        let emphasisIndex = -1;
        let emphasisLength = 0;
        let effectiveEmphasisLength = 0;
        // Match all emphasis-looking runs in the line...
        while ((match = emphasisRe.exec(line))) {
          const matchIndex = match.index + match[1].length;
          const matchLength = match[0].length - match[1].length;
          if (emphasisIndex === -1) {
            // New run
            emphasisIndex = matchIndex + matchLength;
            emphasisLength = matchLength;
            effectiveEmphasisLength = matchLength;
          } else if (matchLength === effectiveEmphasisLength) {
            // Close current run
            const content = line.substring(emphasisIndex, matchIndex);
            const leftSpace = leftSpaceRe.test(content);
            const rightSpace = rightSpaceRe.test(content);
            if (leftSpace || rightSpace) {
              // Report the violation
              const contextStart = emphasisIndex - emphasisLength;
              const contextEnd = matchIndex + effectiveEmphasisLength;
              const context = line.substring(contextStart, contextEnd);
              const column = contextStart + 1;
              const length = contextEnd - contextStart;
              const leftMarker = line.substring(contextStart, emphasisIndex);
              const rightMarker = match[2] || match[3];
              const fixedText = `${leftMarker}${content.trim()}${rightMarker}`;
              addErrorContext(
                onError,
                lineIndex + 1,
                context,
                leftSpace,
                rightSpace,
                [ column, length ],
                {
                  "editColumn": column,
                  "deleteCount": length,
                  "insertText": fixedText
                }
              );
            }
            // Reset
            emphasisIndex = -1;
            emphasisLength = 0;
            effectiveEmphasisLength = 0;
          } else if (matchLength === 3) {
            // Swap internal run length (1->2 or 2->1)
            effectiveEmphasisLength = matchLength - effectiveEmphasisLength;
          } else if (effectiveEmphasisLength === 3) {
            // Downgrade internal run (3->1 or 3->2)
            effectiveEmphasisLength -= matchLength;
          } else {
            // Upgrade to internal run (1->3 or 2->3)
            effectiveEmphasisLength += matchLength;
          }
        }
      }
    );
  }
};

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
        // Match all emphasis-looking runs in the line...
        while ((match = emphasisRe.exec(line))) {
          const matchIndex = match.index + match[1].length;
          const matchLength = match[0].length - match[1].length;
          if (emphasisIndex === -1) {
            // New run
            emphasisLength = matchLength;
            emphasisIndex = matchIndex + emphasisLength;
          } else {
            // Already in a run
            if (matchLength !== emphasisLength) {
              // Looks like a run within a run, reset to embedded run
              emphasisLength += matchLength;
              emphasisIndex = matchIndex + emphasisLength;
            }
            // Extract emphasized content
            const content = line.substring(emphasisIndex, matchIndex);
            const leftSpace = leftSpaceRe.test(content);
            const rightSpace = rightSpaceRe.test(content);
            if (leftSpace || rightSpace) {
              // Report the violation
              const contextStart = emphasisIndex - emphasisLength;
              const contextEnd = matchIndex + emphasisLength;
              const context = line.substring(contextStart, contextEnd);
              const column = contextStart + 1;
              const length = contextEnd - contextStart;
              const marker = match[2] || match[3];
              const fixedText = `${marker}${content.trim()}${marker}`;
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
            // Update the run
            emphasisLength -= matchLength;
            if (!emphasisLength) {
              emphasisIndex = -1;
            }
          }
        }
      }
    );
  }
};

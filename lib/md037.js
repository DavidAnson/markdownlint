// @ts-check

"use strict";

const { addErrorContext, emphasisMarkersInContent, forEachLine, isBlankLine } =
  require("../helpers");
const { lineMetadata } = require("./cache");

const emphasisRe = /(^|[^\\]|\\\\)(?:(\*\*?\*?)|(__?_?))/g;
const embeddedUnderscoreRe = /([A-Za-z0-9])_([A-Za-z0-9])/g;
const asteriskListItemMarkerRe = /^([\s>]*)\*(\s+)/;
const leftSpaceRe = /^\s+/;
const rightSpaceRe = /\s+$/;
const tablePipeRe = /\|/;

module.exports = {
  "names": [ "MD037", "no-space-in-emphasis" ],
  "description": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "function": function MD037(params, onError) {
    // eslint-disable-next-line init-declarations
    let effectiveEmphasisLength, emphasisIndex, emphasisKind, emphasisLength,
      pendingError = null;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function resetRunTracking() {
      emphasisIndex = -1;
      emphasisLength = 0;
      emphasisKind = "";
      effectiveEmphasisLength = 0;
      pendingError = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function handleRunEnd(
      line, lineIndex, contextLength, match, matchIndex, inTable
    ) {
      // Close current run
      let content = line.substring(emphasisIndex, matchIndex);
      if (!emphasisLength) {
        content = content.trimStart();
      }
      if (!match) {
        content = content.trimEnd();
      }
      const leftSpace = leftSpaceRe.test(content);
      const rightSpace = rightSpaceRe.test(content);
      if (
        (leftSpace || rightSpace) &&
        (!inTable || !tablePipeRe.test(content))
      ) {
        // Report the violation
        const contextStart = emphasisIndex - emphasisLength;
        const contextEnd = matchIndex + contextLength;
        const context = line.substring(contextStart, contextEnd);
        const column = contextStart + 1;
        const length = contextEnd - contextStart;
        const leftMarker = line.substring(contextStart, emphasisIndex);
        const rightMarker = match ? (match[2] || match[3]) : "";
        const fixedText = `${leftMarker}${content.trim()}${rightMarker}`;
        return [
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
        ];
      }
      return null;
    }
    // Initialize
    const ignoreMarkersByLine = emphasisMarkersInContent(params);
    resetRunTracking();
    forEachLine(
      lineMetadata(),
      (line, lineIndex, inCode, onFence, inTable, inItem, onBreak, inMath) => {
        const onItemStart = (inItem === 1);
        if (
          inCode ||
          onFence ||
          inTable ||
          onBreak ||
          onItemStart ||
          isBlankLine(line)
        ) {
          // Emphasis resets when leaving a block
          resetRunTracking();
        }
        if (
          inCode ||
          onFence ||
          onBreak ||
          inMath
        ) {
          // Emphasis has no meaning here
          return;
        }
        let patchedLine = line.replace(embeddedUnderscoreRe, "$1 $2");
        if (onItemStart) {
          // Trim overlapping '*' list item marker
          patchedLine = patchedLine.replace(asteriskListItemMarkerRe, "$1 $2");
        }
        let match = null;
        // Match all emphasis-looking runs in the line...
        while ((match = emphasisRe.exec(patchedLine))) {
          const ignoreMarkersForLine = ignoreMarkersByLine[lineIndex];
          const matchIndex = match.index + match[1].length;
          if (ignoreMarkersForLine.includes(matchIndex)) {
            // Ignore emphasis markers inside code spans and links
            continue;
          }
          const matchLength = match[0].length - match[1].length;
          const matchKind = (match[2] || match[3])[0];
          if (emphasisIndex === -1) {
            // New run
            emphasisIndex = matchIndex + matchLength;
            emphasisLength = matchLength;
            emphasisKind = matchKind;
            effectiveEmphasisLength = matchLength;
          } else if (matchKind === emphasisKind) {
            // Matching emphasis markers
            if (matchLength === effectiveEmphasisLength) {
              // Ending an existing run, report any pending error
              if (pendingError) {
                // @ts-ignore
                addErrorContext(...pendingError);
                pendingError = null;
              }
              const error = handleRunEnd(
                line,
                lineIndex,
                effectiveEmphasisLength,
                match,
                matchIndex,
                inTable
              );
              if (error) {
                // @ts-ignore
                addErrorContext(...error);
              }
              // Reset
              resetRunTracking();
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
            // Back up one character so RegExp has a chance to match the
            // next marker (ex: "**star**_underscore_")
            if (emphasisRe.lastIndex > 1) {
              emphasisRe.lastIndex--;
            }
          } else if (emphasisRe.lastIndex > 1) {
            // Back up one character so RegExp has a chance to match the
            // mis-matched marker (ex: "*text_*")
            emphasisRe.lastIndex--;
          }
        }
        if (emphasisIndex !== -1) {
          pendingError = pendingError ||
            handleRunEnd(line, lineIndex, 0, null, line.length, inTable);
          // Adjust for pending run on new line
          emphasisIndex = 0;
          emphasisLength = 0;
        }
      }
    );
  }
};

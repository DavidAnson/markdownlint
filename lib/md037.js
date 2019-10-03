// @ts-check

"use strict";

const { addErrorContext, forEachInlineChild } = require("../helpers");

const leftSpaceRe = /(?:^|\s)(\*\*?\*?|__?_?)\s.*[^\\]\1/g;
const rightSpaceRe = /(?:^|[^\\])(\*\*?\*?|__?_?).+\s\1(?:\s|$)/g;

module.exports = {
  "names": [ "MD037", "no-space-in-emphasis" ],
  "description": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "function": function MD037(params, onError) {
    forEachInlineChild(params, "text", (token) => {
      const { content, lineNumber } = token;
      const columnsReported = [];
      [ leftSpaceRe, rightSpaceRe ].forEach((spaceRe, index) => {
        let match = null;
        while ((match = spaceRe.exec(content)) !== null) {
          const [ fullText, marker ] = match;
          const line = params.lines[lineNumber - 1];
          if (line.includes(fullText)) {
            const text = fullText.trim();
            const column = line.indexOf(text) + 1;
            if (!columnsReported.includes(column)) {
              const length = text.length;
              const markerLength = marker.length;
              const emphasized =
                text.slice(markerLength, length - markerLength);
              const fixedText = `${marker}${emphasized.trim()}${marker}`;
              addErrorContext(
                onError,
                lineNumber,
                text,
                index === 0,
                index !== 0,
                [ column, length ],
                {
                  "editColumn": column,
                  "deleteCount": length,
                  "insertText": fixedText
                }
              );
              columnsReported.push(column);
            }
          }
        }
      });
    });
  }
};

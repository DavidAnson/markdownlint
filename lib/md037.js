// @ts-check

"use strict";

const { addError } = require("../helpers");

module.exports = {
  "names": [ "MD037", "no-space-in-emphasis" ],
  "description": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "function": function MD037(params, onError) {

    // Initialize variables
    const { lines, parsers } = params;
    const emphasisTokensByMarker = new Map();
    for (const marker of [ "_", "__", "___", "*", "**", "***" ]) {
      emphasisTokensByMarker.set(marker, []);
    }
    const pending = [ ...parsers.micromark.tokens ];
    let token = null;
    while ((token = pending.shift())) {

      // Use reparsed children of htmlFlow tokens
      if (token.type === "htmlFlow") {
        pending.unshift(...token.htmlFlowChildren);
        continue;
      }
      pending.push(...token.children);

      // Build lists of bare tokens for each emphasis marker type
      for (const emphasisTokens of emphasisTokensByMarker.values()) {
        emphasisTokens.length = 0;
      }
      for (const child of token.children) {
        const { text, type } = child;
        if ((type === "data") && (text.length <= 3)) {
          const emphasisTokens = emphasisTokensByMarker.get(text);
          if (emphasisTokens) {
            emphasisTokens.push(child);
          }
        }
      }

      // Process bare tokens for each emphasis marker type
      for (const entry of emphasisTokensByMarker.entries()) {
        const [ marker, emphasisTokens ] = entry;
        for (let i = 0; i + 1 < emphasisTokens.length; i += 2) {

          // Process start token of start/end pair
          const startToken = emphasisTokens[i];
          const startLine = lines[startToken.startLine - 1];
          const startSlice = startLine.slice(startToken.endColumn - 1);
          const startMatch = startSlice.match(/^\s+\S/);
          if (startMatch) {
            const [ startSpaceCharacter ] = startMatch;
            const startContext = `${marker}${startSpaceCharacter}`;
            addError(
              onError,
              startToken.startLine,
              undefined,
              startContext,
              [ startToken.startColumn, startContext.length ],
              {
                "editColumn": startToken.endColumn,
                "deleteCount": startSpaceCharacter.length - 1
              }
            );
          }

          // Process end token of start/end pair
          const endToken = emphasisTokens[i + 1];
          const endLine = lines[endToken.startLine - 1];
          const endSlice = endLine.slice(0, endToken.startColumn - 1);
          const endMatch = endSlice.match(/\S\s+$/);
          if (endMatch) {
            const [ endSpaceCharacter ] = endMatch;
            const endContext = `${endSpaceCharacter}${marker}`;
            addError(
              onError,
              endToken.startLine,
              undefined,
              endContext,
              [ endToken.endColumn - endContext.length, endContext.length ],
              {
                "editColumn":
                  endToken.startColumn - (endSpaceCharacter.length - 1),
                "deleteCount": endSpaceCharacter.length - 1
              }
            );
          }
        }
      }
    }
  }
};

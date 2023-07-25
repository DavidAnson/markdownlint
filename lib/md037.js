// @ts-check

"use strict";

const { addError } = require("../helpers");

const emphasisStartTextRe = /^(\S{1,3})(\s+)\S/;
const emphasisEndTextRe = /\S(\s+)(\S{1,3})$/;

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
      for (const emphasisTokens of emphasisTokensByMarker.values()) {
        for (let i = 0; i + 1 < emphasisTokens.length; i += 2) {

          // Process start token of start/end pair
          const startToken = emphasisTokens[i];
          const startText =
            lines[startToken.startLine - 1].slice(startToken.startColumn - 1);
          const startMatch = startText.match(emphasisStartTextRe);
          if (startMatch) {
            const [ startContext, startMarker, startSpaces ] = startMatch;
            if ((startMarker === startToken.text) && (startSpaces.length > 0)) {
              addError(
                onError,
                startToken.startLine,
                undefined,
                startContext,
                [ startToken.startColumn, startContext.length ],
                {
                  "editColumn": startToken.endColumn,
                  "deleteCount": startSpaces.length
                }
              );
            }
          }

          // Process end token of start/end pair
          const endToken = emphasisTokens[i + 1];
          const endText =
            lines[endToken.startLine - 1].slice(0, endToken.endColumn - 1);
          const endMatch = endText.match(emphasisEndTextRe);
          if (endMatch) {
            const [ endContext, endSpace, endMarker ] = endMatch;
            if ((endMarker === endToken.text) && (endSpace.length > 0)) {
              addError(
                onError,
                endToken.startLine,
                undefined,
                endContext,
                [ endToken.endColumn - endContext.length, endContext.length ],
                {
                  "editColumn": endToken.startColumn - endSpace.length,
                  "deleteCount": endSpace.length
                }
              );
            }
          }
        }
      }
    }
  }
};

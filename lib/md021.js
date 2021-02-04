// @ts-check

"use strict";

const { addErrorContext, filterTokens, headingStyleFor } =
  require("../helpers");

module.exports = {
  "names": [ "MD021", "no-multiple-space-closed-atx" ],
  "description": "Multiple spaces inside hashes on closed atx style heading",
  "tags": [ "headings", "headers", "atx_closed", "spaces" ],
  "function": function MD021(params, onError) {
    filterTokens(params, "heading_open", (token) => {
      if (headingStyleFor(token) === "atx_closed") {
        const { line, lineNumber } = token;
        const match = /^(#+)([ \t]+)([^#]+?)([ \t]+)(#+)(\s*)$/.exec(line);
        if (match) {
          const [
            ,
            leftHash,
            { "length": leftSpaceLength },
            content,
            { "length": rightSpaceLength },
            rightHash,
            { "length": trailSpaceLength }
          ] = match;
          const left = leftSpaceLength > 1;
          const right = rightSpaceLength > 1;
          if (left || right) {
            const length = line.length;
            const leftHashLength = leftHash.length;
            const rightHashLength = rightHash.length;
            const range = left ?
              [
                1,
                leftHashLength + leftSpaceLength + 1
              ] :
              [
                length - trailSpaceLength - rightHashLength - rightSpaceLength,
                rightSpaceLength + rightHashLength + 1
              ];
            addErrorContext(
              onError,
              lineNumber,
              line.trim(),
              left,
              right,
              range,
              {
                "editColumn": 1,
                "deleteCount": length,
                "insertText": `${leftHash} ${content} ${rightHash}`
              }
            );
          }
        }
      }
    });
  }
};

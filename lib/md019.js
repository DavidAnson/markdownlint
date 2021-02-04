// @ts-check

"use strict";

const { addErrorContext, filterTokens, headingStyleFor } =
  require("../helpers");

module.exports = {
  "names": [ "MD019", "no-multiple-space-atx" ],
  "description": "Multiple spaces after hash on atx style heading",
  "tags": [ "headings", "headers", "atx", "spaces" ],
  "function": function MD019(params, onError) {
    filterTokens(params, "heading_open", (token) => {
      if (headingStyleFor(token) === "atx") {
        const { line, lineNumber } = token;
        const match = /^(#+)([ \t]{2,})(?:\S)/.exec(line);
        if (match) {
          const [
            ,
            { "length": hashLength },
            { "length": spacesLength }
          ] = match;
          addErrorContext(
            onError,
            lineNumber,
            line.trim(),
            null,
            null,
            [ 1, hashLength + spacesLength + 1 ],
            {
              "editColumn": hashLength + 1,
              "deleteCount": spacesLength - 1
            }
          );
        }
      }
    });
  }
};

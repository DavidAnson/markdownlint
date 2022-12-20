// @ts-check

"use strict";

const { addErrorContext, filterTokens } = require("../helpers");

const spaceBeforeHeadingRe = /^(\s+|[>\s]+\s\s)[^>\s]/;

module.exports = {
  "names": [ "MD023", "heading-start-left", "header-start-left" ],
  "description": "Headings must start at the beginning of the line",
  "tags": [ "headings", "headers", "spaces" ],
  "function": function MD023(params, onError) {
    filterTokens(params, "heading_open", function forToken(token) {
      const { lineNumber, line } = token;
      const match = line.match(spaceBeforeHeadingRe);
      if (match) {
        const [ prefixAndFirstChar, prefix ] = match;
        let deleteCount = prefix.length;
        const prefixLengthNoSpace = prefix.trimEnd().length;
        if (prefixLengthNoSpace) {
          deleteCount -= prefixLengthNoSpace - 1;
        }
        addErrorContext(
          onError,
          lineNumber,
          line,
          null,
          null,
          [ 1, prefixAndFirstChar.length ],
          {
            "editColumn": prefixLengthNoSpace + 1,
            "deleteCount": deleteCount
          });
      }
    });
  }
};

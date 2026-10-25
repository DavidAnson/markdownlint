// @ts-check

"use strict";

/** @type {import("markdownlint").Rule} */
module.exports = {
  "names": [ "first-line" ],
  "description": "Rule that reports an error for the first line",
  "tags": [ "test" ],
  "parser": "none",
  "function": function rule(params, onError) {
    // Unconditionally report an error for line 1 of content
    onError({
      "lineNumber": 1
    });
    // Report an error for line 1 of front matter if present
    if (params.frontMatterLines.length > 0) {
      onError({
        "frontMatter": true,
        "lineNumber": 1
      });
    }
  }
};

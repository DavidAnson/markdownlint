// @ts-check

"use strict";

/** @type {import("markdownlint").Rule} */
module.exports = {
  "names": [ "first-line" ],
  "description": "Rule that reports an error for the first line",
  "tags": [ "test" ],
  "parser": "none",
  "function": function rule(params, onError) {
    // Unconditionally report an error for line 1
    onError({
      "lineNumber": 1
    });
  }
};

// @ts-check

"use strict";

const { filterTokens } = require("markdownlint-rule-helpers");

module.exports = {
  "names": [ "validate-json" ],
  "description": "Rule that validates JSON code",
  "tags": [ "test", "validate", "json" ],
  "asynchronous": true,
  "function": async(params, onError) => {
    const { "default": stripJsonComments } =
      await import("strip-json-comments");
    filterTokens(params, "fence", (fence) => {
      if (/jsonc?/i.test(fence.info)) {
        try {
          JSON.parse(stripJsonComments(fence.content));
        } catch (error) {
          onError({
            "lineNumber": fence.lineNumber,
            "detail": error.message
          });
        }
      }
    });
  }
};

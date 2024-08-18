// @ts-check

"use strict";

const { parse, printParseErrorCode } = require("jsonc-parser");

/** @type import("../../lib/markdownlint").Rule */
module.exports = {
  "names": [ "validate-json" ],
  "description": "Rule that validates JSON code",
  "tags": [ "test", "validate", "json" ],
  "parser": "markdownit",
  "asynchronous": true,
  "function": (params, onError) => {
    const fences = params.parsers.markdownit.tokens.
      filter((token => token.type === "fence"));
    for (const fence of fences) {
      if (/jsonc?/i.test(fence.info)) {
        const errors = [];
        parse(fence.content, errors);
        if (errors.length > 0) {
          const detail = errors.map(
            (err) => `${printParseErrorCode(err.error)} (offset ${err.offset}, length ${err.length})`
          ).join(", ");
          onError({
            // @ts-ignore
            "lineNumber": fence.lineNumber,
            detail
          });
        }
      }
    }
  }
};

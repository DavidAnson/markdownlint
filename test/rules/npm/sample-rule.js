// @ts-check

"use strict";

module.exports = {
  "names": [ "sample-rule" ],
  "description": "Sample rule",
  "tags": [ "sample" ],
  "function": function rule(params, onError) {
    params.tokens.forEach((token) => {
      if (token.type === "hr") {
        onError({
          "lineNumber": token.lineNumber,
          "detail": "Sample error for hr"
        });
      }
    });
  }
};

// @ts-check

"use strict";

module.exports = {
  "names": [ "first-line" ],
  "description": "Rule that reports an error for the first line",
  "tags": [ "test" ],
  "function": function rule(params, onError) {
    // Unconditionally report an error for line 1
    onError({
      "lineNumber": 1
    });
  }
};

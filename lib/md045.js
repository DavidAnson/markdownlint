// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD045", "no-alt-text" ],
  "description": "Images should have alternate text (alt text)",
  "tags": [ "accessibility", "images" ],
  "function": function MD045(params, onError) {
    shared.forEachInlineChild(params, "image", function forToken(token) {
      if (token.content === "") {
        shared.addError(onError, token.lineNumber);
      }
    });
  }
};

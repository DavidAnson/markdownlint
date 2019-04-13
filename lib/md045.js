// @ts-check

"use strict";

const { addError, forEachInlineChild } = require("../helpers");

module.exports = {
  "names": [ "MD045", "no-alt-text" ],
  "description": "Images should have alternate text (alt text)",
  "tags": [ "accessibility", "images" ],
  "function": function MD045(params, onError) {
    forEachInlineChild(params, "image", function forToken(token) {
      if (token.content === "") {
        addError(onError, token.lineNumber);
      }
    });
  }
};

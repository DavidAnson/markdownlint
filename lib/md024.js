// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD024", "no-duplicate-heading", "no-duplicate-header" ],
  "description": "Multiple headings with the same content",
  "tags": [ "headings", "headers" ],
  "function": function MD024(params, onError) {
    const knownContent = [];
    shared.forEachHeading(params, function forHeading(heading, content) {
      if (knownContent.indexOf(content) === -1) {
        knownContent.push(content);
      } else {
        shared.addErrorContext(onError, heading.lineNumber,
          heading.line.trim());
      }
    });
  }
};

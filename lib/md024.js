// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD024", "no-duplicate-header" ],
  "description": "Multiple headers with the same content",
  "tags": [ "headers" ],
  "function": function MD024(params, onError) {
    var knownContent = [];
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

// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD024", "no-duplicate-heading", "no-duplicate-header" ],
  "description": "Multiple headings with the same content",
  "tags": [ "headings", "headers" ],
  "function": function MD024(params, onError) {
    const siblingsOnly = params.config.siblings_only ||
      params.config.allow_different_nesting || false;
    const knownContents = [ null, [] ];
    let lastLevel = 1;
    let knownContent = knownContents[lastLevel];
    shared.forEachHeading(params, function forHeading(heading, content) {
      if (siblingsOnly) {
        const newLevel = heading.tag.slice(1);
        while (lastLevel < newLevel) {
          lastLevel++;
          knownContents[lastLevel] = [];
        }
        while (lastLevel > newLevel) {
          knownContents[lastLevel] = [];
          lastLevel--;
        }
        knownContent = knownContents[newLevel];
      }
      if (knownContent.indexOf(content) === -1) {
        knownContent.push(content);
      } else {
        shared.addErrorContext(onError, heading.lineNumber,
          heading.line.trim());
      }
    });
  }
};

// @ts-check

"use strict";

const { addErrorContext, forEachHeading } = require("../helpers");

module.exports = {
  "names": [ "MD024", "no-duplicate-heading", "no-duplicate-header" ],
  "description": "Multiple headings with the same content",
  "tags": [ "headings", "headers" ],
  "function": function MD024(params, onError) {
    const siblingsOnly = !!params.config.siblings_only ||
      !!params.config.allow_different_nesting || false;
    const knownContents = [ null, [] ];
    let lastLevel = 1;
    let knownContent = knownContents[lastLevel];
    forEachHeading(params, (heading, content) => {
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
      if (knownContent.includes(content)) {
        addErrorContext(onError, heading.lineNumber,
          heading.line.trim());
      } else {
        knownContent.push(content);
      }
    });
  }
};

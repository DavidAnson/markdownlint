// @ts-check

"use strict";

const { addErrorContext, forEachHeading } = require("../helpers");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD024", "no-duplicate-heading" ],
  "description": "Multiple headings with the same content",
  "tags": [ "headings" ],
  "parser": "markdownit",
  "function": function MD024(params, onError) {
    const siblingsOnly = !!params.config.siblings_only || false;
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
      // @ts-ignore
      if (knownContent.includes(content)) {
        addErrorContext(
          onError,
          heading.lineNumber,
          heading.line.trim()
        );
      } else {
        // @ts-ignore
        knownContent.push(content);
      }
    });
  }
};

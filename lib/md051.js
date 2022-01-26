// @ts-check

"use strict";

const { filterTokens, addError, forEachHeading } = require("../helpers");

/**
 * Slugifies strings.
 *
 * @param {string} string The string to slugify.
 * @returns {string} The slugified string.
 */
function slugify(string) {
  return string
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}[\]=_`~()]/g, "")
    .split(" ")
    .join("-");
}

module.exports = {
  "names": [ "MD051", "no-dead-hash-links-within-document" ],
  "description": "No dead hash links within document",
  "tags": [ "links" ],
  "function": function MD051(params, onError) {
    const headings = [];
    forEachHeading(params, (_heading, content) => {
      headings.push("#" + slugify(content));
    });
    filterTokens(params, "inline", (token) => {
      token.children.forEach((child) => {
        const { lineNumber, type, attrs } = child;
        if (type === "link_open") {
          const href = attrs.find((attr) => attr[0] === "href");
          if (href !== undefined &&
              typeof href[1] === "string" &&
              href[1].length >= 2 &&
              href[1].startsWith("#")
          ) {
            const hasHeading = headings.includes(href[1]);
            if (!hasHeading) {
              const detail = "Link is dead (no corresponding heading)";
              addError(onError, lineNumber, detail, href[1]);
            }
          }
        }
      });
    });
  }
};

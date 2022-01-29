// @ts-check

"use strict";

const { addError, forEachHeading, filterTokens } = require("../helpers");

/**
 * Converts a Markdown heading into an HTML fragment
 * according to the rules used by GitHub.
 *
 * @param {string} string The string to convert.
 * @returns {string} The converted string.
 */
function convertHeadingToHTMLFragment(string) {
  return "#" + string
    .toLowerCase()
    .replace(/[.,/#?!$%^&*;:{}[\]=`~"'()]/g, "")
    .replace(/ /g, "-");
}

module.exports = {
  "names": [ "MD051", "valid-link-fragments" ],
  "description": "Link fragments should be valid",
  "tags": [ "links" ],
  "function": function MD051(params, onError) {
    const headings = [];
    forEachHeading(params, (_heading, content) => {
      headings.push(convertHeadingToHTMLFragment(content));
    });
    filterTokens(params, "inline", (token) => {
      token.children.forEach((child) => {
        const { lineNumber, type, attrs } = child;
        if (type === "link_open") {
          const href = attrs.find((attr) => attr[0] === "href");
          if (href !== undefined &&
              href[1].startsWith("#") &&
              !headings.includes(href[1])
          ) {
            const detail = "Link Fragment is invalid";
            addError(onError, lineNumber, detail, href[1]);
          }
        }
      });
    });
  }
};

// @ts-check

"use strict";

const { addError, escapeForRegExp, filterTokens, forEachLine, forEachHeading,
  htmlElementRe, overlapsAnyRange } = require("../helpers");
const { codeBlockAndSpanRanges, lineMetadata } = require("./cache");

// Regular expression for identifying HTML anchor names
const identifierRe = /(?:id|name)\s*=\s*['"]?([^'"\s>]+)/iu;

/**
 * Converts a Markdown heading into an HTML fragment according to the rules
 * used by GitHub.
 *
 * @param {Object} inline Inline token for heading.
 * @returns {string} Fragment string for heading.
 */
function convertHeadingToHTMLFragment(inline) {
  const inlineText = inline.children.map((token) => token.content).join("");
  return "#" + inlineText
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^-_a-z0-9]/g, "");
}

module.exports = {
  "names": [ "MD051", "link-fragments" ],
  "description": "Link fragments should be valid",
  "tags": [ "links" ],
  "function": function MD051(params, onError) {
    const fragments = new Set();
    forEachHeading(params, (heading, content, inline) => {
      fragments.add(convertHeadingToHTMLFragment(inline));
    });
    const exclusions = codeBlockAndSpanRanges();
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      let match = null;
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!inCode && ((match = htmlElementRe.exec(line)) !== null)) {
        const [ tag, , element ] = match;
        if (
          (element.toLowerCase() === "a") &&
          !overlapsAnyRange(exclusions, lineIndex, match.index, match[0].length)
        ) {
          const idMatch = identifierRe.exec(tag);
          if (idMatch) {
            fragments.add(`#${idMatch[1]}`);
          }
        }
      }
    });
    filterTokens(params, "inline", (token) => {
      for (const child of token.children) {
        const { attrs, lineNumber, line, type } = child;
        if (type === "link_open") {
          const href = attrs.find((attr) => attr[0] === "href");
          const id = href && href[1];
          if (id && (id.length > 1) && (id[0] === "#") && !fragments.has(id)) {
            let context = id;
            let range = null;
            const match = line.match(
              new RegExp(`\\[.*?\\]\\(${escapeForRegExp(context)}\\)`)
            );
            if (match) {
              context = match[0];
              range = [ match.index + 1, match[0].length ];
            }
            addError(onError, lineNumber, null, context, range);
          }
        }
      }
    });
  }
};

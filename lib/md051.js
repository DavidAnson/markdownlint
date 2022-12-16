// @ts-check

"use strict";

const { addError, addErrorDetailIf, escapeForRegExp, filterTokens,
  forEachInlineChild, forEachHeading, htmlElementRe } = require("../helpers");

// Regular expression for identifying HTML anchor names
const idRe = /\sid\s*=\s*['"]?([^'"\s>]+)/iu;
const nameRe = /\sname\s*=\s*['"]?([^'"\s>]+)/iu;

/**
 * Converts a Markdown heading into an HTML fragment according to the rules
 * used by GitHub.
 *
 * @param {Object} inline Inline token for heading.
 * @returns {string} Fragment string for heading.
 */
function convertHeadingToHTMLFragment(inline) {
  const inlineText = inline.children
    .filter((token) => token.type !== "html_inline")
    .map((token) => token.content)
    .join("");
  return "#" + encodeURIComponent(
    inlineText
      .toLowerCase()
      // RegExp source with Ruby's \p{Word} expanded into its General Categories
      // eslint-disable-next-line max-len
      // https://github.com/gjtorikian/html-pipeline/blob/main/lib/html/pipeline/toc_filter.rb
      // https://ruby-doc.org/core-3.0.2/Regexp.html
      .replace(
        /[^\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation}\- ]/gu,
        ""
      )
      .replace(/ /gu, "-")
  );
}

module.exports = {
  "names": [ "MD051", "link-fragments" ],
  "description": "Link fragments should be valid",
  "tags": [ "links" ],
  "function": function MD051(params, onError) {
    const fragments = new Map();
    // Process headings
    forEachHeading(params, (heading, content, inline) => {
      const fragment = convertHeadingToHTMLFragment(inline);
      const count = fragments.get(fragment) || 0;
      if (count) {
        fragments.set(`${fragment}-${count}`, 0);
      }
      fragments.set(fragment, count + 1);
    });
    // Process HTML anchors
    const processHtmlToken = (token) => {
      let match = null;
      while ((match = htmlElementRe.exec(token.content)) !== null) {
        const [ tag, , element ] = match;
        const anchorMatch = idRe.exec(tag) ||
            (element.toLowerCase() === "a" && nameRe.exec(tag));
        if (anchorMatch) {
          fragments.set(`#${anchorMatch[1]}`, 0);
        }
      }
    };
    filterTokens(params, "html_block", processHtmlToken);
    forEachInlineChild(params, "html_inline", processHtmlToken);
    // Process link fragments
    forEachInlineChild(params, "link_open", (token) => {
      const { attrs, lineNumber, line } = token;
      const href = attrs.find((attr) => attr[0] === "href");
      const id = href && href[1];
      if (id && (id.length > 1) && (id[0] === "#") && !fragments.has(id)) {
        let context = id;
        let range = null;
        let fixInfo = null;
        const match = line.match(
          new RegExp(`\\[.*?\\]\\(${escapeForRegExp(context)}\\)`)
        );
        if (match) {
          [ context ] = match;
          const index = match.index;
          const length = context.length;
          range = [ index + 1, length ];
          fixInfo = {
            "editColumn": index + (length - id.length),
            "deleteCount": id.length,
            "insertText": null
          };
        }
        const idLower = id.toLowerCase();
        const mixedCaseKey = [ ...fragments.keys() ]
          .find((key) => idLower === key.toLowerCase());
        if (mixedCaseKey) {
          (fixInfo || {}).insertText = mixedCaseKey;
          addErrorDetailIf(
            onError,
            lineNumber,
            mixedCaseKey,
            id,
            undefined,
            context,
            range,
            fixInfo
          );
        } else {
          addError(
            onError,
            lineNumber,
            undefined,
            context,
            // @ts-ignore
            range
          );
        }
      }
    });
  }
};

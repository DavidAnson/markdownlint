// @ts-check

"use strict";

const { addErrorContext, allPunctuation } = require("../helpers");

module.exports = {
  "names": [ "MD036", "no-emphasis-as-heading", "no-emphasis-as-header" ],
  "description": "Emphasis used instead of a heading",
  "tags": [ "headings", "headers", "emphasis" ],
  "function": function MD036(params, onError) {
    let punctuation = params.config.punctuation;
    punctuation =
      String((punctuation === undefined) ? allPunctuation : punctuation);
    const re = new RegExp("[" + punctuation + "]$");
    // eslint-disable-next-line jsdoc/require-jsdoc
    function base(token) {
      if (token.type === "paragraph_open") {
        return function inParagraph(t) {
          // Always paragraph_open/inline/paragraph_close,
          const children = t.children.filter(function notEmptyText(child) {
            return (child.type !== "text") || (child.content !== "");
          });
          if ((children.length === 3) &&
              ((children[0].type === "strong_open") ||
                (children[0].type === "em_open")) &&
              (children[1].type === "text") &&
              !re.test(children[1].content)) {
            addErrorContext(onError, t.lineNumber,
              children[1].content);
          }
          return base;
        };
      } else if (token.type === "blockquote_open") {
        return function inBlockquote(t) {
          if (t.type !== "blockquote_close") {
            return inBlockquote;
          }
          return base;
        };
      } else if (token.type === "list_item_open") {
        return function inListItem(t) {
          if (t.type !== "list_item_close") {
            return inListItem;
          }
          return base;
        };
      }
      return base;
    }
    let state = base;
    for (const token of params.tokens) {
      state = state(token);
    }
  }
};

// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");

module.exports = {
  "names": [ "MD036", "no-emphasis-as-heading", "no-emphasis-as-header" ],
  "description": "Emphasis used instead of a heading",
  "tags": [ "headings", "headers", "emphasis" ],
  "function": function MD036(params, onError) {
    const punctuation = params.config.punctuation || ".,;:!?";
    const re = new RegExp("[" + punctuation + "]$");
    function base(token) {
      if (token.type === "paragraph_open") {
        return function inParagraph(t) {
          // Always paragraph_open/inline/paragraph_close,
          // omit (t.type === "inline")
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
    params.tokens.forEach(function forToken(token) {
      state = state(token);
    });
  }
};

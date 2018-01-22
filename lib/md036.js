// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD036", "no-emphasis-as-header" ],
  "description": "Emphasis used instead of a header",
  "tags": [ "headers", "emphasis" ],
  "function": function MD036(params, onError) {
    var punctuation = params.config.punctuation || ".,;:!?";
    var re = new RegExp("[" + punctuation + "]$");
    function base(token) {
      if (token.type === "paragraph_open") {
        return function inParagraph(t) {
          // Always paragraph_open/inline/paragraph_close,
          // omit (t.type === "inline")
          var children = t.children.filter(function notEmptyText(child) {
            return (child.type !== "text") || (child.content !== "");
          });
          if ((children.length === 3) &&
              ((children[0].type === "strong_open") ||
                (children[0].type === "em_open")) &&
              (children[1].type === "text") &&
              !re.test(children[1].content)) {
            shared.addErrorContext(onError, t.lineNumber,
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
    var state = base;
    params.tokens.forEach(function forToken(token) {
      state = state(token);
    });
  }
};

module.exports = {
  "name": "MD036",
  "desc": "Emphasis used instead of a header",
  "tags": [ "headers", "emphasis" ],
  "aliases": [ "no-emphasis-as-header" ],
  "regexp": null,
  "func": function MD036(params, errors) {
    var punctuation = params.options.punctuation || ".,;:!?";
    var re = new RegExp("[" + punctuation + "]$");
    function base(token) {
      if (token.type === "paragraph_open") {
        return function inParagraph(t) {
          if ((t.type === "inline") &&
              (t.children.length === 3) &&
              ((t.children[0].type === "strong_open") ||
                (t.children[0].type === "em_open")) &&
              (t.children[1].type === "text") &&
              !re.test(t.children[1].content)) {
            errors.addContext(t.lineNumber, t.children[1].content);
          }
        };
      } else if (token.type === "blockquote_open") {
        return function inBlockquote(t) {
          if (t.type !== "blockquote_close") {
            return inBlockquote;
          }
        };
      } else if (token.type === "list_item_open") {
        return function inListItem(t) {
          if (t.type !== "list_item_close") {
            return inListItem;
          }
        };
      }
    }
    var state = base;
    params.tokens.forEach(function forToken(token) {
      state = state(token) || base;
    });
  }
};

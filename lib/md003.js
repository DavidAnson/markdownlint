// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD003", "heading-style", "header-style" ],
  "description": "Heading style",
  "tags": [ "headings", "headers" ],
  "function": function MD003(params, onError) {
    let style = params.config.style || "consistent";
    shared.filterTokens(params, "heading_open", function forToken(token) {
      const styleForToken = shared.headingStyleFor(token);
      if (style === "consistent") {
        style = styleForToken;
      }
      if (styleForToken !== style) {
        const h12 = /h[12]/.test(token.tag);
        const setextWithAtx =
          (style === "setext_with_atx") &&
            ((h12 && (styleForToken === "setext")) ||
            (!h12 && (styleForToken === "atx")));
        const setextWithAtxClosed =
          (style === "setext_with_atx_closed") &&
            ((h12 && (styleForToken === "setext")) ||
            (!h12 && (styleForToken === "atx_closed")));
        if (!setextWithAtx && !setextWithAtxClosed) {
          let expected = style;
          if (style === "setext_with_atx") {
            expected = h12 ? "setext" : "atx";
          } else if (style === "setext_with_atx_closed") {
            expected = h12 ? "setext" : "atx_closed";
          }
          shared.addErrorDetailIf(onError, token.lineNumber,
            expected, styleForToken);
        }
      }
    });
  }
};

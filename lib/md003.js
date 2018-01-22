// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD003", "header-style" ],
  "description": "Header style",
  "tags": [ "headers" ],
  "function": function MD003(params, onError) {
    var style = params.config.style || "consistent";
    shared.filterTokens(params, "heading_open", function forToken(token) {
      var styleForToken = shared.headingStyleFor(token);
      if (style === "consistent") {
        style = styleForToken;
      }
      if (styleForToken !== style) {
        var h12 = /h[12]/.test(token.tag);
        var setextWithAtx =
          (style === "setext_with_atx") &&
            ((h12 && (styleForToken === "setext")) ||
            (!h12 && (styleForToken === "atx")));
        var setextWithAtxClosed =
          (style === "setext_with_atx_closed") &&
            ((h12 && (styleForToken === "setext")) ||
            (!h12 && (styleForToken === "atx_closed")));
        if (!setextWithAtx && !setextWithAtxClosed) {
          var expected = style;
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

var shared = require("../shared");

module.exports = {
  "name": "MD003",
  "desc": "Header style",
  "tags": [ "headers" ],
  "aliases": [ "header-style" ],
  "regexp": null,
  "func": function MD003(params, errors) {
    var style = params.options.style || "consistent";
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
          errors.addDetailIf(token.lineNumber, expected, styleForToken);
        }
      }
    });
  }
};

// @ts-check

"use strict";

const { addErrorDetailIf } = require("../helpers");

function fencedCodeBlockStyleFor(markup) {
  switch (markup[0]) {
    case "~":
      return "tilde";
    default:
      return "backtick";
  }
}

module.exports = {
  "names": [ "MD048", "code-fence-style" ],
  "description": "Code fence style",
  "tags": [ "code" ],
  "function": function MD048(params, onError) {
    const style = params.config.style || "consistent";
    let expectedStyle = style;
    params.tokens
      .filter((token) => token.type === "fence")
      .forEach((fenceToken) => {
        const { lineNumber, markup } = fenceToken;
        if (expectedStyle === "consistent") {
          expectedStyle = fencedCodeBlockStyleFor(markup);
        }
        addErrorDetailIf(
          onError,
          lineNumber,
          expectedStyle,
          fencedCodeBlockStyleFor(markup)
        );
      });
  }
};

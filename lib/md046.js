// @ts-check

"use strict";

const { addErrorDetailIf } = require("../helpers");

const tokenTypeToStyle = {
  "fence": "fenced",
  "code_block": "indented"
};

module.exports = {
  "names": [ "MD046", "code-block-style" ],
  "description": "Code block style",
  "tags": [ "code" ],
  "function": function MD046(params, onError) {
    let expectedStyle = String(params.config.style || "consistent");
    params.tokens
      .filter((token) => token.type === "code_block" || token.type === "fence")
      .forEach((token) => {
        const { lineNumber, type } = token;
        if (expectedStyle === "consistent") {
          expectedStyle = tokenTypeToStyle[type];
        }
        addErrorDetailIf(
          onError,
          lineNumber,
          expectedStyle,
          tokenTypeToStyle[type]);
      });
  }
};

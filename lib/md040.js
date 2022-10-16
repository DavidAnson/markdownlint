// @ts-check

"use strict";

const { addErrorContext, filterTokens, addError } = require("../helpers");

module.exports = {
  "names": [ "MD040", "fenced-code-language" ],
  "description": "Fenced code blocks should have a language specified",
  "tags": [ "code", "language" ],
  "function": function MD040(params, onError) {
    let allowlist = params.config.allowlist;
    allowlist = Array.isArray(allowlist) ? allowlist : null;
    filterTokens(params, "fence", function forToken(token) {
      const lang = token.info.trim();
      if (lang === "") {
        addErrorContext(onError, token.lineNumber, token.line);
        return;
      }
      if (allowlist !== null && allowlist.includes(lang) === false) {
        addError(
          onError,
          token.lineNumber,
          `language '${lang}' is not included in allowlist`
        );
      }
    });
  }
};

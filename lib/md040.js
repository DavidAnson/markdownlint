// @ts-check

"use strict";

const { addError, addErrorContext, filterTokens } = require("../helpers");

module.exports = {
  "names": [ "MD040", "fenced-code-language" ],
  "description": "Fenced code blocks should have a language specified",
  "tags": [ "code", "language" ],
  "function": function MD040(params, onError) {
    let allowed = params.config.allowed_languages;
    allowed = Array.isArray(allowed) ? allowed : [];
    const languageOnly = !!params.config.language_only;

    filterTokens(params, "fence", function forToken(token) {
      const lang = token.info.trim().split(/\s+/u).shift();
      if (lang === "") {
        addErrorContext(onError, token.lineNumber, token.line);
      } else if ((allowed.length > 0) && !allowed.includes(lang)) {
        addError(
          onError,
          token.lineNumber,
          `"${lang}" is not allowed`
        );
      }

      if (languageOnly && (token.info !== lang)) {
        addError(
          onError,
          token.lineNumber,
          `Info string contains more than language: "${token.info}"`
        );
      }
    });
  }
};

// @ts-check

"use strict";

const { addErrorContext, filterTokens, newLineRe, rangeFromRegExp } =
  require("../helpers");

const dollarCommandRe = /^(\s*)(\$\s)/;

module.exports = {
  "names": [ "MD014", "commands-show-output" ],
  "description": "Dollar signs used before commands without showing output",
  "tags": [ "code" ],
  "function": function MD014(params, onError) {
    [ "code_block", "fence" ].forEach(function forType(type) {
      filterTokens(params, type, function forToken(token) {
        let allBlank = true;
        if (token.content && token.content.split(newLineRe)
          .every(function forLine(line) {
            return !line || (allBlank = false) || dollarCommandRe.test(line);
          }) && !allBlank) {
          addErrorContext(onError, token.lineNumber,
            token.content.split(newLineRe)[0].trim(), null, null,
            rangeFromRegExp(token.line, dollarCommandRe));
        }
      });
    });
  }
};

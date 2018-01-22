// @ts-check

"use strict";

var shared = require("./shared");

var dollarCommandRe = /^(\s*)(\$\s)/;

module.exports = {
  "names": [ "MD014", "commands-show-output" ],
  "description": "Dollar signs used before commands without showing output",
  "tags": [ "code" ],
  "function": function MD014(params, onError) {
    [ "code_block", "fence" ].forEach(function forType(type) {
      shared.filterTokens(params, type, function forToken(token) {
        var allBlank = true;
        if (token.content && token.content.split(shared.newLineRe)
          .every(function forLine(line) {
            return !line || (allBlank = false) || dollarCommandRe.test(line);
          }) && !allBlank) {
          shared.addErrorContext(onError, token.lineNumber,
            token.content.split(shared.newLineRe)[0].trim(), null, null,
            shared.rangeFromRegExp(token.line, dollarCommandRe));
        }
      });
    });
  }
};

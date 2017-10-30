var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD014",
  "desc": "Dollar signs used before commands without showing output",
  "tags": [ "code" ],
  "aliases": [ "commands-show-output" ],
  "regexp": expressions.dollarCommandRe,
  "func": function MD014(params, errors) {
    [ "code_block", "fence" ].forEach(function forType(type) {
      shared.filterTokens(params, type, function forToken(token) {
        var allBlank = true;
        if (token.content && token.content.split(shared.newLineRe)
          .every(function forLine(line) {
            return !line || (allBlank = false) || expressions.dollarCommandRe.test(line);
          }) && !allBlank) {
          errors.addContext(token.lineNumber,
            token.content.split(shared.newLineRe)[0].trim());
        }
      });
    });
  }
};

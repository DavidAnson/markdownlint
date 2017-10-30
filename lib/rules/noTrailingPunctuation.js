var shared = require("../shared");
var expressions = require("../expressions");

module.exports = {
  "name": "MD026",
  "desc": "Trailing punctuation in header",
  "tags": [ "headers" ],
  "aliases": [ "no-trailing-punctuation" ],
  "regexp": expressions.trailingPunctuationRe,
  "func": function MD026(params, errors) {
    var punctuation = params.options.punctuation || ".,;:!?";
    var re = new RegExp("[" + punctuation + "]$");
    shared.forEachHeading(params, function forHeading(heading, content) {
      var match = re.exec(content);
      if (match) {
        errors.addDetail(heading.lineNumber,
          "Punctuation: '" + match[0] + "'");
      }
    });
  }
};

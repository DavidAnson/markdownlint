var shared = require("../shared");

module.exports = {
  "name": "MD024",
  "desc": "Multiple headers with the same content",
  "tags": [ "headers" ],
  "aliases": [ "no-duplicate-header" ],
  "regexp": null,
  "func": function MD024(params, errors) {
    var knownContent = [];
    shared.forEachHeading(params, function forHeading(heading, content) {
      if (knownContent.indexOf(content) === -1) {
        knownContent.push(content);
      } else {
        errors.addContext(heading.lineNumber, heading.line.trim());
      }
    });
  }
};

var shared = require("../shared");

module.exports = {
  "name": "MD043",
  "desc": "Required header structure",
  "tags": [ "headers" ],
  "aliases": [ "required-headers" ],
  "regexp": null,
  "func": function MD043(params, errors) {
    var requiredHeaders = params.options.headers;
    if (requiredHeaders) {
      var levels = {};
      [ 1, 2, 3, 4, 5, 6 ].forEach(function forLevel(level) {
        levels["h" + level] = "######".substr(-level);
      });
      var i = 0;
      var optional = false;
      shared.forEachHeading(params, function forHeading(heading, content) {
        if (!errors.length) {
          var actual = levels[heading.tag] + " " + content;
          var expected = requiredHeaders[i++] || "[None]";
          if (expected === "*") {
            optional = true;
          } else if (expected.toLowerCase() === actual.toLowerCase()) {
            optional = false;
          } else if (optional) {
            i--;
          } else {
            errors.addDetailIf(heading.lineNumber, expected, actual);
          }
        }
      });
      if ((i < requiredHeaders.length) && !errors.length) {
        errors.addContext(params.lines.length, requiredHeaders[i]);
      }
    }
  }
};

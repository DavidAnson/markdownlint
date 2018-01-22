// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD043", "required-headers" ],
  "description": "Required header structure",
  "tags": [ "headers" ],
  "function": function MD043(params, onError) {
    var requiredHeaders = params.config.headers;
    if (requiredHeaders) {
      var levels = {};
      [ 1, 2, 3, 4, 5, 6 ].forEach(function forLevel(level) {
        levels["h" + level] = "######".substr(-level);
      });
      var i = 0;
      var optional = false;
      var errorCount = 0;
      shared.forEachHeading(params, function forHeading(heading, content) {
        if (!errorCount) {
          var actual = levels[heading.tag] + " " + content;
          var expected = requiredHeaders[i++] || "[None]";
          if (expected === "*") {
            optional = true;
          } else if (expected.toLowerCase() === actual.toLowerCase()) {
            optional = false;
          } else if (optional) {
            i--;
          } else {
            shared.addErrorDetailIf(onError, heading.lineNumber,
              expected, actual);
            errorCount++;
          }
        }
      });
      if ((i < requiredHeaders.length) && !errorCount) {
        shared.addErrorContext(onError, params.lines.length,
          requiredHeaders[i]);
      }
    }
  }
};

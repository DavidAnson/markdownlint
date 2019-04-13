// @ts-check

"use strict";

const { addErrorContext, addErrorDetailIf, forEachHeading } =
  require("../helpers");

module.exports = {
  "names": [ "MD043", "required-headings", "required-headers" ],
  "description": "Required heading structure",
  "tags": [ "headings", "headers" ],
  "function": function MD043(params, onError) {
    const requiredHeadings = params.config.headings || params.config.headers;
    if (requiredHeadings) {
      const levels = {};
      [ 1, 2, 3, 4, 5, 6 ].forEach(function forLevel(level) {
        levels["h" + level] = "######".substr(-level);
      });
      let i = 0;
      let optional = false;
      let errorCount = 0;
      forEachHeading(params, function forHeading(heading, content) {
        if (!errorCount) {
          const actual = levels[heading.tag] + " " + content;
          const expected = requiredHeadings[i++] || "[None]";
          if (expected === "*") {
            optional = true;
          } else if (expected.toLowerCase() === actual.toLowerCase()) {
            optional = false;
          } else if (optional) {
            i--;
          } else {
            addErrorDetailIf(onError, heading.lineNumber,
              expected, actual);
            errorCount++;
          }
        }
      });
      if ((i < requiredHeadings.length) && !errorCount) {
        addErrorContext(onError, params.lines.length,
          requiredHeadings[i]);
      }
    }
  }
};

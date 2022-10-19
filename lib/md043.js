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
    const matchCase = params.config.match_case || false;
    if (Array.isArray(requiredHeadings)) {
      const levels = {};
      for (const level of [ 1, 2, 3, 4, 5, 6 ]) {
        levels["h" + level] = "######".substr(-level);
      }
      let i = 0;
      let matchAny = false;
      let hasError = false;
      let anyHeadings = false;
      const getExpected = () => requiredHeadings[i++] || "[None]";
      const handleCase = (str) => (matchCase ? str : str.toLowerCase());
      forEachHeading(params, (heading, content) => {
        if (!hasError) {
          anyHeadings = true;
          const actual = levels[heading.tag] + " " + content;
          const expected = getExpected();
          if (expected === "*") {
            const nextExpected = getExpected();
            if (handleCase(nextExpected) !== handleCase(actual)) {
              matchAny = true;
              i--;
            }
          } else if (expected === "+") {
            matchAny = true;
          } else if (handleCase(expected) === handleCase(actual)) {
            matchAny = false;
          } else if (matchAny) {
            i--;
          } else {
            addErrorDetailIf(onError, heading.lineNumber,
              expected, actual);
            hasError = true;
          }
        }
      });
      const extraHeadings = requiredHeadings.length - i;
      if (
        !hasError &&
        ((extraHeadings > 1) ||
          ((extraHeadings === 1) && (requiredHeadings[i] !== "*"))) &&
        (anyHeadings || !requiredHeadings.every((heading) => heading === "*"))
      ) {
        addErrorContext(onError, params.lines.length,
          requiredHeadings[i]);
      }
    }
  }
};

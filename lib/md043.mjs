// @ts-check

import { addErrorContext, addErrorDetailIf } from "../helpers/helpers.cjs";
import { getHeadingLevel, getHeadingText } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

export const headingsItemsRe = /^([*+?]|\^+|[#%]{1,6}\s+\S.*)$/u;
const headingPartsRe = /^([#%]{1,6})\s+(\S.*)$/u;

const headingIsExpected = (/** @type {string} */ actual, /** @type {string} */ expected, /** @type {boolean} */ matchCase) => {
  if (expected.startsWith("%")) {
    // Regular expression comparison
    const [ , actualLevel, actualText ] = headingPartsRe.exec(actual) || [];
    const [ , expectedLevel, expectedText ] = headingPartsRe.exec(expected) || [];
    return (
      (actualLevel.length === expectedLevel.length) &&
      // eslint-disable-next-line unicorn/no-unreadable-new-expression
      (new RegExp(expectedText, `${matchCase ? "" : "i"}u`)).test(actualText)
    );
  }
  // Text comparison
  const actualLower = matchCase ? actual : actual.toLowerCase();
  const expectedLower = matchCase ? expected : expected.toLowerCase();
  return actualLower === expectedLower;
};

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD043", "required-headings" ],
  "description": "Required heading structure",
  "tags": [ "headings" ],
  "parser": "micromark",
  "function": function MD043(params, onError) {
    /** @type {string[] | null | undefined} */
    const headings = params.config.headings;
    if (!headings) {
      // Nothing to check
      return;
    }
    const requiredHeadings = headings.map((heading) => headingsItemsRe.test(heading) ? heading : "[Invalid syntax]");
    const matchCase = params.config.match_case || false;
    let i = 0;
    let matchAny = false;
    let hasError = false;
    let anyHeadings = false;
    const getExpected = () => requiredHeadings[i++] || "[No heading]";
    for (const heading of filterByTypesCached([ "atxHeading", "setextHeading" ])) {
      if (!hasError) {
        const headingText = getHeadingText(heading);
        const headingLevel = getHeadingLevel(heading);
        anyHeadings = true;
        const actual = `${"".padEnd(headingLevel, "#")} ${headingText}`;
        let expected = getExpected();

        if (expected.startsWith("^")) {
          const save = i;
          const nextExpected = getExpected();
          if (headingIsExpected(actual, nextExpected, matchCase)) {
            expected = nextExpected;
          } else {
            for (let j = save - 1; j--; j >= 0) {
              if (requiredHeadings[j] === expected) {
                i = j + 1;
                expected = getExpected();
                break;
              }
            }
            if (i < 0) {
              // Nothing to skip back to; continue from current location
              i = save;
            }
          }
        }

        if (expected === "*") {
          const nextExpected = getExpected();
          if (!headingIsExpected(actual, nextExpected, matchCase)) {
            matchAny = true;
            i--;
          }
        } else if (expected === "+") {
          matchAny = true;
        } else if (expected === "?") {
          // Allow current, match next
        } else if (headingIsExpected(actual, expected, matchCase)) {
          matchAny = false;
        } else if (matchAny) {
          i--;
        } else {
          addErrorDetailIf(
            onError,
            heading.startLine,
            expected,
            actual
          );
          hasError = true;
        }
      }
    }
    const extraHeadings = requiredHeadings.length - i;
    if (
      !hasError &&
      ((extraHeadings > 1) ||
        ((extraHeadings === 1) &&
          ((requiredHeadings[i] !== "*") && (requiredHeadings[i] !== "^")))) &&
      (anyHeadings || !requiredHeadings.every((heading) => heading === "*"))
    ) {
      addErrorContext(
        onError,
        params.lines.length,
        requiredHeadings[i]
      );
    }
  }
};

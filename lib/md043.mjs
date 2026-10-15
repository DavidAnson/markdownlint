// @ts-check

import { addError, addErrorDetailIf } from "../helpers/helpers.cjs";
import { getHeadingLevel, getHeadingText } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

export const headingsItemsRe = /^(?:[*+?]|\^+|[#%]{1,6}\s+\S.*)$/u;
const prefixedHeadingPartsRe = /^([#%]{1,6})\s+(\S.*)$/u;
const loopHeadingRe = /^\^+$/u;
const canMatchNothingHeadingsRe = /^(?:\*|\^+)$/u;
const maximumLoopsAllowed = 1000;

const headingIsExpected = (/** @type {string} */ actual, /** @type {string} */ expected, /** @type {boolean} */ matchCase) => {
  if (expected.startsWith("%")) {
    // Regular expression comparison
    const [ , actualLevel, actualText ] = prefixedHeadingPartsRe.exec(actual) || [];
    const [ , expectedLevel, expectedText ] = prefixedHeadingPartsRe.exec(expected) || [];
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
      return;
    }
    const requiredHeadings = headings.map((heading) => headingsItemsRe.test(heading) ? heading : "[Invalid syntax]");
    const matchCase = Boolean(params.config.match_case);
    let i = 0;
    let remainingLoopsAllowed = maximumLoopsAllowed;
    let allowAnyMatchFallback = false;
    let hasError = false;
    const getExpected = (/** @type {boolean} */ skipLoopHeadings) => {
      let expected = null;
      do {
        expected = requiredHeadings[i++] || "[No heading]";
        // eslint-disable-next-line no-unmodified-loop-condition
      } while (skipLoopHeadings && loopHeadingRe.test(expected));
      return expected;
    };
    for (const heading of filterByTypesCached([ "atxHeading", "setextHeading" ])) {
      const headingText = getHeadingText(heading);
      const headingLevel = getHeadingLevel(heading);
      const actual = `${"".padEnd(headingLevel, "#")} ${headingText}`;
      let expected = getExpected(false);
      if (expected.startsWith("^")) {
        // Handle loop
        const current = i;
        const nextExpected = getExpected(true);
        if (headingIsExpected(actual, nextExpected, matchCase)) {
          // No need to loop (again)
          expected = nextExpected;
        } else {
          // Try to loop to previous matching marker
          remainingLoopsAllowed--;
          let j = current - 2;
          for (; j >= 0; j--) {
            if (requiredHeadings[j] === expected) {
              // Perform loop
              i = j + 1;
              expected = getExpected(false);
              break;
            }
          }
          if (j < 0) {
            // No matching loop marker
            expected = nextExpected;
          }
        }
      }
      if (remainingLoopsAllowed < 0) {
        // Too many loops performed
        addError(onError, heading.startLine, "Too many loops", `Limit: ${maximumLoopsAllowed}`);
        hasError = true;
        break;
      } else if (expected === "*") {
        // Handle "zero or more of anything"
        const nextExpected = getExpected(true);
        if (!headingIsExpected(actual, nextExpected, matchCase)) {
          allowAnyMatchFallback = true;
          i--;
        }
      } else if (expected === "+") {
        // Handle "one or more of anything"
        allowAnyMatchFallback = true;
      } else if (expected === "?") {
        // Handle "exactly one of anything"
        // Nothing to do
      } else if (headingIsExpected(actual, expected, matchCase)) {
        // Handle successful match
        allowAnyMatchFallback = false;
      } else if (allowAnyMatchFallback) {
        // Handle "anything" match by restoring index
        i--;
      } else {
        // Report heading mismatch
        addErrorDetailIf(onError, heading.startLine, expected, actual);
        hasError = true;
        break;
      }
    }
    const remainingRequiredHeadings = requiredHeadings.slice(i).filter((heading) => !canMatchNothingHeadingsRe.test(heading));
    if (
      !hasError &&
      (remainingRequiredHeadings.length > 0)
    ) {
      // Report unmatched heading(s)
      addErrorDetailIf(onError, params.lines.length, remainingRequiredHeadings[0], "[End of file]");
    }
  }
};

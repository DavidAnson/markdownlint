// @ts-check

import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { lint } from "markdownlint/promise";
import { applyFixes } from "markdownlint";
import helpers from "../helpers/helpers.cjs";
import { fixableRuleNames } from "../lib/constants.mjs";

const numericalSortCompareFn = (/** @type {number} */ a, /** @type {number} */ b) => a - b;

/**
 * Create a test function for the specified test file.
 *
 * @param {string} file Test file relative path.
 * @returns {import("node:test").TestFn} Test function.
 */
function createTestForFile(file) {
  return (t) => (
    // Read and lint Markdown test file
    Promise.all([
      fs.readFile(file, "utf8"),
      lint({
        "files": [ file ]
      })
    ])
      // Compare expected results and snapshot
      .then((params) => {
        const [ content, results ] = params;
        // Canonicalize version number
        const errors = results[file]
          .filter((error) => !!error.ruleInformation);
        for (const error of errors) {
          error.ruleInformation =
            // @ts-ignore
            error.ruleInformation.replace(/v\d+\.\d+\.\d+/, "v0.0.0");
        }
        // Match identified issues by MD### markers
        const marker = /\{(MD\d+)(?::([-+]?)(\d+))?\}/g;
        const lines = content.split(helpers.newLineRe);
        /** @type {Object.<string, number[]>} */
        const expected = {};
        // @ts-ignore
        for (const [ index, line ] of lines.entries()) {
          let match = null;
          while ((match = marker.exec(line))) {
            const [ , rule, delta, value ] = match;
            let lineNumber = index + 1;
            if (value) {
              const valueInt = Number(value);
              if (delta) {
                lineNumber += ((delta === "+") ? 1 : -1) * valueInt;
              } else {
                lineNumber = valueInt;
              }
            }
            // eslint-disable-next-line no-multi-assign
            const indices = (expected[rule] ||= []);
            if (!indices.includes(lineNumber)) {
              indices.push(lineNumber);
            }
          }
        }
        for (const list of Object.values(expected)) {
          list.sort(numericalSortCompareFn);
        }
        /** @type {Object.<string, number[]>} */
        const actual = {};
        for (const error of errors) {
          const rule = error.ruleNames[0];
          // eslint-disable-next-line no-multi-assign
          const indices = (actual[rule] ||= []);
          if (indices[indices.length - 1] !== error.lineNumber) {
            indices.push(error.lineNumber);
          }
          t.assert.equal(
            !error.fixInfo || fixableRuleNames.includes(rule),
            true,
            `Fixable rule ${rule} is not tagged as such.`
          );
        }
        for (const list of Object.values(actual)) {
          list.sort(numericalSortCompareFn);
        }
        t.assert.deepEqual(actual, expected, "Too few or too many issues found.");
        // Create snapshot
        const fixed = applyFixes(content, errors)
          .replace(/\r\n/g, "\n");
        t.assert.snapshot({
          errors,
          fixed
        });
        // Identify missing fixes
        return lint({
          "strings": {
            "input": fixed
          }
        }).then((fixedResults) => {
          const unfixed = fixedResults.input.filter((error) => !!error.fixInfo);
          t.assert.deepEqual(unfixed, [], "Fixable error(s) not fixed.");
        });
      })
      .catch()
  );
}

const dir = await fs.readdir("./test");
const files = dir.filter((file) => /\.md$/.test(file));

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  for (const file of files) {
    test(file, createTestForFile(path.join("./test", file)));
  }

});

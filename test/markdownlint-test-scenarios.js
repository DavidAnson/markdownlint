// @ts-check

"use strict";

const fs = require("node:fs").promises;
const path = require("node:path");
const test = require("ava").default;
const { markdownlint } = require("../lib/markdownlint").promises;
const helpers = require("../helpers");
const constants = require("../lib/constants");

const numericalSortCompareFn = (a, b) => a - b;

/**
 * Create a test function for the specified test file.
 *
 * @param {string} file Test file relative path.
 * @returns {import("ava").Implementation<unknown[]>} Test function.
 */
function createTestForFile(file) {
  return (t) => (
    // Read and lint Markdown test file
    Promise.all([
      fs.readFile(file, "utf8"),
      markdownlint({
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
              error.ruleInformation.replace(/v\d+\.\d+\.\d+/, "v0.0.0");
        }
        // Match identified issues by MD### markers
        const marker = /\{(MD\d+)(?::([-+]?)(\d+))?\}/g;
        const lines = content.split(helpers.newLineRe);
        const expected = {};
        // @ts-ignore
        for (const [ index, line ] of lines.entries()) {
          let match = null;
          while ((match = marker.exec(line))) {
            const [ , rule, delta, value ] = match;
            let lineNumber = index + 1;
            if (value) {
              const valueInt = Number.parseInt(value, 10);
              if (delta) {
                lineNumber += ((delta === "+") ? 1 : -1) * valueInt;
              } else {
                lineNumber = valueInt;
              }
            }
            // eslint-disable-next-line no-multi-assign
            const indices = expected[rule] = expected[rule] || [];
            if (!indices.includes(lineNumber)) {
              indices.push(lineNumber);
            }
          }
        }
        for (const list of Object.values(expected)) {
          list.sort(numericalSortCompareFn);
        }
        const actual = {};
        for (const error of errors) {
          const rule = error.ruleNames[0];
          // eslint-disable-next-line no-multi-assign
          const indices = actual[rule] = actual[rule] || [];
          if (indices[indices.length - 1] !== error.lineNumber) {
            indices.push(error.lineNumber);
          }
          t.true(
            !error.fixInfo || constants.fixableRuleNames.includes(rule),
            `Fixable rule ${rule} is not tagged as such.`
          );
        }
        for (const list of Object.values(actual)) {
          list.sort(numericalSortCompareFn);
        }
        t.deepEqual(actual, expected, "Too few or too many issues found.");
        // Create snapshot
        const fixed = helpers.applyFixes(content, errors)
          .replace(/\r\n/g, "\n");
        t.snapshot({
          errors,
          fixed
        });
        // Identify missing fixes
        return markdownlint({
          "strings": {
            "input": fixed
          }
        }).then((fixedResults) => {
          const unfixed = fixedResults.input.filter((error) => !!error.fixInfo);
          t.deepEqual(unfixed, [], "Fixable error(s) not fixed.");
        });
      })
      .catch()
  );
}

const files = require("node:fs")
  .readdirSync("./test")
  .filter((file) => /\.md$/.test(file));
for (const file of files) {
  // @ts-ignore
  test(
    file,
    createTestForFile(path.join("./test", file))
  );
}

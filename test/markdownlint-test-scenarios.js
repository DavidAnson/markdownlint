// @ts-check

"use strict";

const fs = require("node:fs").promises;
const path = require("node:path");
const test = require("ava").default;
const { markdownlint } = require("../lib/markdownlint").promises;
const helpers = require("../helpers");

/**
 * Create a test function for the specified test file.
 *
 * @param {string} file Test file relative path.
 * @returns {Function} Test function.
 */
function createTestForFile(file) {
  return (t) => {
    // Read configuration for test file
    const contentPromise = fs.readFile(file, "utf8");
    const configFile = file.replace(/\.md$/, ".json");
    return fs.access(configFile)
      .then(
        () => fs.readFile(configFile, "utf8").then(JSON.parse),
        () => {}
      // Read and lint Markdown test file
      ).then((config) => Promise.all([
        config,
        contentPromise,
        markdownlint({
          "files": [ file ],
          config
        })
      ]))
      // Compare expected results and snapshot
      .then((params) => {
        const [ config, content, results ] = params;
        // Canonicalize version number
        const errors = results[file]
          .filter((error) => !!error.ruleInformation);
        for (const error of errors) {
          error.ruleInformation =
              error.ruleInformation.replace(/v\d+\.\d+\.\d+/, "v0.0.0");
        }
        // Match identified issues by MD### markers
        const marker = /\{(MD\d+)(?::(\d+))?\}/g;
        const lines = content.split(helpers.newLineRe);
        const expected = {};
        // @ts-ignore
        for (const [ index, line ] of lines.entries()) {
          let match = null;
          while ((match = marker.exec(line))) {
            const rule = match[1];
            // eslint-disable-next-line no-multi-assign
            const indices = expected[rule] = expected[rule] || [];
            indices.push(match[2] ? Number.parseInt(match[2], 10) : index + 1);
          }
        }
        if (Object.keys(expected).length > 0) {
          const actual = {};
          for (const error of errors) {
            const rule = error.ruleNames[0];
            // eslint-disable-next-line no-multi-assign
            const indices = actual[rule] = actual[rule] || [];
            if (indices[indices.length - 1] !== error.lineNumber) {
              indices.push(error.lineNumber);
            }
          }
          t.deepEqual(actual, expected, "Too few or too many issues found.");
        }
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
          },
          config
        }).then((fixedResults) => {
          const unfixed = fixedResults.input.filter((error) => !!error.fixInfo);
          t.deepEqual(unfixed, [], "Fixable error(s) not fixed.");
        });
      })
      .catch()
      .then(t.done);
  };
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

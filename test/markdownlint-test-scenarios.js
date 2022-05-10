// @ts-check

"use strict";

const fs = require("fs").promises;
const path = require("path");
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
        const errors = results[file];
        errors
          .filter((error) => !!error.ruleInformation)
          .forEach((error) => {
            error.ruleInformation =
              error.ruleInformation.replace(/v\d+\.\d+\.\d+/, "v0.0.0");
          });
        // Match identified issues by MD### markers
        const marker = /\{(MD\d+)(?::(\d+))?\}/g;
        const lines = content.split(helpers.newLineRe);
        const expected = {};
        lines.forEach((line, index) => {
          let match = null;
          while ((match = marker.exec(line))) {
            const rule = match[1];
            // eslint-disable-next-line no-multi-assign
            const indices = expected[rule] = expected[rule] || [];
            indices.push(match[2] ? Number.parseInt(match[2], 10) : index + 1);
          }
        });
        if (Object.keys(expected).length > 0) {
          const actual = {};
          errors.forEach((error) => {
            const rule = error.ruleNames[0];
            // eslint-disable-next-line no-multi-assign
            const indices = actual[rule] = actual[rule] || [];
            if (indices[indices.length - 1] !== error.lineNumber) {
              indices.push(error.lineNumber);
            }
          });
          t.deepEqual(actual, expected, "Too few or too many issues found.");
        }
        // Create snapshot
        const fixed = helpers.applyFixes(content, errors)
          .replace(/\r\n/g, "\n");
        t.snapshot({
          errors,
          fixed
        });
        return {
          config,
          fixed
        };
      })
      // Identify missing fixes
      .then((params) => {
        const { config, fixed } = params;
        return markdownlint({
          "strings": {
            "input": fixed
          },
          config
        }).then((results) => {
          const unfixed = results.input.filter((error) => !!error.fixInfo);
          t.deepEqual(unfixed, [], "Fixable error(s) not fixed.");
        });
      })
      .catch()
      .then(t.done);
  };
}

require("fs").readdirSync("./test")
  .filter((file) => /\.md$/.test(file))
  // @ts-ignore
  .forEach((file) => test(
    file,
    createTestForFile(path.join("./test", file))
  ));

// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const test = require("ava").default;
const { version } = require("../package.json");
const markdownlint = require("../lib/markdownlint");
const helpers = require("../helpers");

/**
 * Create a test function for the specified test file.
 *
 * @param {string} file Test file relative path.
 * @returns {Function} Test function.
 */
function createTestForFile(file) {
  const markdownlintPromise = promisify(markdownlint);
  return function testForFile(t) {
    const detailedResults = /[/\\]detailed-results-/.test(file);
    t.plan(detailedResults ? 3 : 2);
    const resultsFile = file.replace(/\.md$/, ".results.json");
    const fixedFile = file.replace(/\.md$/, ".md.fixed");
    const configFile = file.replace(/\.md$/, ".json");
    let config = null;
    const actualPromise = fs.promises.stat(configFile)
      .then(
        function configFileExists() {
          return fs.promises.readFile(configFile, "utf8")
            // @ts-ignore
            .then(JSON.parse);
        },
        function noConfigFile() {
          return {};
        })
      .then(
        function captureConfig(configResult) {
          config = configResult;
        }
      )
      .then(
        function lintWithConfig() {
          return markdownlintPromise({
            "files": [ file ],
            config,
            "resultVersion": 3
          });
        })
      .then(
        function diffFixedFiles(resultVersion2or3) {
          return detailedResults ?
            Promise.all([
              markdownlintPromise({
                "files": [ file ],
                config,
                "resultVersion": 3
              }),
              fs.promises.readFile(file, "utf8"),
              fs.promises.readFile(fixedFile, "utf8")
            ])
              .then(function validateApplyFixes(fulfillments) {
                const [ resultVersion3, content, expected ] = fulfillments;
                const errors = resultVersion3[file];
                const actual = helpers.applyFixes(content, errors);
                // Uncomment the following line to update *.md.fixed files
                // fs.writeFileSync(fixedFile, actual, "utf8");
                t.is(actual, expected, "Unexpected output from applyFixes.");
                return resultVersion2or3;
              }) :
            resultVersion2or3;
        }
      )
      .then(
        function convertResultVersion2To0(resultVersion2or3) {
          const result0 = {};
          const result2or3 = resultVersion2or3[file];
          result2or3.forEach(function forResult(result) {
            const ruleName = result.ruleNames[0];
            const lineNumbers = result0[ruleName] || [];
            if (!lineNumbers.includes(result.lineNumber)) {
              lineNumbers.push(result.lineNumber);
            }
            result0[ruleName] = lineNumbers;
          });
          return [ result0, result2or3 ];
        }
      );
    const expectedPromise = detailedResults ?
      fs.promises.readFile(resultsFile, "utf8")
        .then(
          function fileContents(contents) {
            // @ts-ignore
            const errorObjects = JSON.parse(contents);
            errorObjects.forEach(function forObject(errorObject) {
              if (errorObject.ruleInformation) {
                errorObject.ruleInformation =
                  errorObject.ruleInformation.replace("v0.0.0", `v${version}`);
              }
            });
            return errorObjects;
          }) :
      fs.promises.readFile(file, "utf8")
        .then(
          function fileContents(contents) {
            // @ts-ignore
            const lines = contents.split(helpers.newLineRe);
            const results = {};
            lines.forEach(function forLine(line, lineNum) {
              const regex = /\{(MD\d+)(?::(\d+))?\}/g;
              let match = null;
              while ((match = regex.exec(line))) {
                const rule = match[1];
                const errors = results[rule] || [];
                errors.push(
                  match[2] ?
                    Number.parseInt(match[2], 10) :
                    lineNum + 1
                );
                results[rule] = errors;
              }
            });
            const sortedResults = {};
            Object.keys(results).sort().forEach(function forKey(key) {
              sortedResults[key] = results[key];
            });
            return sortedResults;
          });
    return Promise.all([ actualPromise, expectedPromise ])
      .then(
        function compareResults(fulfillments) {
          const [ [ actual0, actual2or3 ], expected ] = fulfillments;
          const actual = detailedResults ? actual2or3 : actual0;
          t.deepEqual(actual, expected, "Line numbers are not correct.");
          return actual2or3;
        })
      .then(
        function verifyFixes(errors) {
          if (detailedResults) {
            return t.true(true);
          }
          return fs.promises.readFile(file, "utf8")
            .then(
              function applyFixes(content) {
                const corrections = helpers.applyFixes(content, errors);
                return markdownlintPromise({
                  "strings": {
                    "input": corrections
                  },
                  config,
                  "resultVersion": 3
                });
              })
            .then(
              function checkFixes(newErrors) {
                const unfixed = newErrors.input
                  .filter((error) => !!error.fixInfo);
                t.deepEqual(unfixed, [], "Fixable error was not fixed.");
              }
            );
        })
      .catch()
      .then(t.done);
  };
}

fs.readdirSync("./test")
  .filter((file) => /\.md$/.test(file))
  // @ts-ignore
  .forEach((file) => test(file, createTestForFile(path.join("./test", file))));

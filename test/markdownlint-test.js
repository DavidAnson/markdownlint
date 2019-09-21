"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { URL } = require("url");
const md = require("markdown-it")();
const pluginInline = require("markdown-it-for-inline");
const pluginKatex = require("markdown-it-katex");
const pluginSub = require("markdown-it-sub");
const pluginSup = require("markdown-it-sup");
const tv4 = require("tv4");
const packageJson = require("../package.json");
const markdownlint = require("../lib/markdownlint");
const helpers = require("../helpers");
const rules = require("../lib/rules");
const customRules = require("./rules/rules.js");
const defaultConfig = require("./markdownlint-test-default-config.json");
const configSchema = require("../schema/markdownlint-config-schema.json");
const homepage = packageJson.homepage;
const version = packageJson.version;

const deprecatedRuleNames = [ "MD002" ];

function promisify(func, ...args) {
  return new Promise((resolve, reject) => {
    func(...args, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function createTestForFile(file) {
  return function testForFile(test) {
    const detailedResults = /[/\\]detailed-results-/.test(file);
    test.expect(detailedResults ? 3 : 2);
    const resultsFile = file.replace(/\.md$/, ".results.json");
    const fixedFile = file.replace(/\.md$/, ".md.fixed");
    const configFile = file.replace(/\.md$/, ".json");
    let mergedConfig = null;
    const actualPromise = promisify(fs.stat, configFile)
      .then(
        function configFileExists() {
          return promisify(fs.readFile, configFile, helpers.utf8Encoding)
            .then(JSON.parse);
        },
        function noConfigFile() {
          return {};
        })
      .then(
        function lintWithConfig(config) {
          mergedConfig = {
            ...defaultConfig,
            ...config
          };
          return promisify(markdownlint, {
            "files": [ file ],
            "config": mergedConfig,
            "resultVersion": detailedResults ? 2 : 3
          });
        })
      .then(
        function diffFixedFiles(resultVersion2or3) {
          return detailedResults ?
            Promise.all([
              promisify(markdownlint, {
                "files": [ file ],
                "config": mergedConfig,
                "resultVersion": 3
              }),
              promisify(fs.readFile, file, helpers.utf8Encoding),
              promisify(fs.readFile, fixedFile, helpers.utf8Encoding)
            ])
              .then(function validateApplyFixes(fulfillments) {
                const [ resultVersion3, content, expected ] = fulfillments;
                const errors = resultVersion3[file];
                const actual = helpers.applyFixes(content, errors);
                // Uncomment the following line to update *.md.fixed files
                // fs.writeFileSync(fixedFile, actual, helpers.utf8Encoding);
                test.equal(actual, expected,
                  "Unexpected output from applyFixes.");
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
      promisify(fs.readFile, resultsFile, helpers.utf8Encoding)
        .then(
          function fileContents(contents) {
            const errorObjects = JSON.parse(contents);
            errorObjects.forEach(function forObject(errorObject) {
              if (errorObject.ruleInformation) {
                errorObject.ruleInformation =
                  errorObject.ruleInformation.replace("v0.0.0", `v${version}`);
              }
            });
            return errorObjects;
          }) :
      promisify(fs.readFile, file, helpers.utf8Encoding)
        .then(
          function fileContents(contents) {
            const lines = contents.split(helpers.newLineRe);
            const results = {};
            lines.forEach(function forLine(line, lineNum) {
              const regex = /\{(MD\d+)(?::(\d+))?\}/g;
              let match = null;
              while ((match = regex.exec(line))) {
                const rule = match[1];
                const errors = results[rule] || [];
                errors.push(match[2] ? parseInt(match[2], 10) : lineNum + 1);
                results[rule] = errors;
              }
            });
            const sortedResults = {};
            Object.keys(results).sort().forEach(function forKey(key) {
              sortedResults[key] = results[key];
            });
            return sortedResults;
          });
    Promise.all([ actualPromise, expectedPromise ])
      .then(
        function compareResults(fulfillments) {
          const [ [ actual0, actual2or3 ], expected ] = fulfillments;
          const actual = detailedResults ? actual2or3 : actual0;
          test.deepEqual(actual, expected, "Line numbers are not correct.");
          return actual2or3;
        })
      .then(
        function verifyFixes(errors) {
          if (detailedResults) {
            return test.ok(true);
          }
          return promisify(fs.readFile, file, helpers.utf8Encoding)
            .then(
              function applyFixes(content) {
                const corrections = helpers.applyFixes(content, errors);
                return promisify(markdownlint, {
                  "strings": {
                    "input": corrections
                  },
                  "config": mergedConfig,
                  "resultVersion": 3
                });
              })
            .then(
              function checkFixes(newErrors) {
                const unfixed = newErrors.input
                  .filter((error) => !!error.fixInfo);
                test.deepEqual(unfixed, [], "Fixable error was not fixed.");
              }
            );
        })
      .catch()
      .then(test.done);
  };
}

fs.readdirSync("./test").forEach(function forFile(file) {
  if (file.match(/\.md$/)) {
    module.exports[file] = createTestForFile(path.join("./test", file));
  }
});

module.exports.projectFiles = function projectFiles(test) {
  test.expect(2);
  const options = {
    "files": [
      "README.md",
      "CONTRIBUTING.md",
      "helpers/README.md"
    ],
    "noInlineConfig": true,
    "config": {
      "MD013": { "line_length": 150 },
      "MD024": false
    }
  };
  markdownlint(options, function callback(err, actual) {
    test.ifError(err);
    const expected = {
      "README.md": [],
      "CONTRIBUTING.md": [],
      "helpers/README.md": []
    };
    test.deepEqual(actual, expected, "Issue(s) with project files.");
    test.done();
  });
};

module.exports.resultFormattingV0 = function resultFormattingV0(test) {
  test.expect(4);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD002": true,
      "MD041": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    let actualMessage = actualResult.toString();
    let expectedMessage =
      "./test/atx_heading_spacing.md: 3: MD002" +
      " First heading should be a top level heading\n" +
      "./test/atx_heading_spacing.md: 1: MD018" +
      " No space after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 3: MD019" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 5: MD019" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/first_heading_bad_atx.md: 1: MD002" +
      " First heading should be a top level heading";
    test.equal(actualMessage, expectedMessage, "Incorrect message (name).");
    actualMessage = actualResult.toString(true);
    expectedMessage =
      "./test/atx_heading_spacing.md: 3: first-heading-h1" +
      " First heading should be a top level heading\n" +
      "./test/atx_heading_spacing.md: 1: no-missing-space-atx" +
      " No space after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 3: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 5: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/first_heading_bad_atx.md: 1: first-heading-h1" +
      " First heading should be a top level heading";
    test.equal(actualMessage, expectedMessage, "Incorrect message (alias).");
    test.done();
  });
};

module.exports.resultFormattingSyncV0 = function resultFormattingSyncV0(test) {
  test.expect(3);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD002": true,
      "MD041": false
    },
    "resultVersion": 0
  };
  const actualResult = markdownlint.sync(options);
  const expectedResult = {
    "./test/atx_heading_spacing.md": {
      "MD002": [ 3 ],
      "MD018": [ 1 ],
      "MD019": [ 3, 5 ]
    },
    "./test/first_heading_bad_atx.md": {
      "MD002": [ 1 ]
    }
  };
  test.deepEqual(actualResult, expectedResult, "Undetected issues.");
  let actualMessage = actualResult.toString();
  let expectedMessage =
    "./test/atx_heading_spacing.md: 3: MD002" +
    " First heading should be a top level heading\n" +
    "./test/atx_heading_spacing.md: 1: MD018" +
    " No space after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 3: MD019" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 5: MD019" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/first_heading_bad_atx.md: 1: MD002" +
    " First heading should be a top level heading";
  test.equal(actualMessage, expectedMessage, "Incorrect message (name).");
  actualMessage = actualResult.toString(true);
  expectedMessage =
    "./test/atx_heading_spacing.md: 3: first-heading-h1" +
    " First heading should be a top level heading\n" +
    "./test/atx_heading_spacing.md: 1: no-missing-space-atx" +
    " No space after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 3: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 5: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/first_heading_bad_atx.md: 1: first-heading-h1" +
    " First heading should be a top level heading";
  test.equal(actualMessage, expectedMessage, "Incorrect message (alias).");
  test.done();
};

module.exports.resultFormattingV1 = function resultFormattingV1(test) {
  test.expect(3);
  const options = {
    "strings": {
      "truncate":
        "#  Multiple spaces inside hashes on closed atx style heading  #\n"
    },
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD002": true,
      "MD041": false
    },
    "resultVersion": 1
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "truncate": [
        { "lineNumber": 1,
          "ruleName": "MD021",
          "ruleAlias": "no-multiple-space-closed-atx",
          "ruleDescription":
            "Multiple spaces inside hashes on closed atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md021`,
          "errorDetail": null,
          "errorContext": "#  Multiple spa...tyle heading  #",
          "errorRange": [ 1, 4 ] }
      ],
      "./test/atx_heading_spacing.md": [
        { "lineNumber": 3,
          "ruleName": "MD002",
          "ruleAlias": "first-heading-h1",
          "ruleDescription": "First heading should be a top level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md002`,
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null },
        { "lineNumber": 1,
          "ruleName": "MD018",
          "ruleAlias": "no-missing-space-atx",
          "ruleDescription": "No space after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md018`,
          "errorDetail": null,
          "errorContext": "#Heading 1 {MD018}",
          "errorRange": [ 1, 2 ] },
        { "lineNumber": 3,
          "ruleName": "MD019",
          "ruleAlias": "no-multiple-space-atx",
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md019`,
          "errorDetail": null,
          "errorContext": "##  Heading 2 {MD019}",
          "errorRange": [ 1, 5 ] },
        { "lineNumber": 5,
          "ruleName": "MD019",
          "ruleAlias": "no-multiple-space-atx",
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md019`,
          "errorDetail": null,
          "errorContext": "##   Heading 3 {MD019}",
          "errorRange": [ 1, 6 ] }
      ],
      "./test/first_heading_bad_atx.md": [
        { "lineNumber": 1,
          "ruleName": "MD002",
          "ruleAlias": "first-heading-h1",
          "ruleDescription": "First heading should be a top level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md002`,
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style heading" +
      " [Context: \"#  Multiple spa...tyle heading  #\"]\n" +
      "./test/atx_heading_spacing.md: 3: MD002/first-heading-h1" +
      " First heading should be a top level heading" +
      " [Expected: h1; Actual: h2]\n" +
      "./test/atx_heading_spacing.md: 1: MD018/no-missing-space-atx" +
      " No space after hash on atx style heading" +
      " [Context: \"#Heading 1 {MD018}\"]\n" +
      "./test/atx_heading_spacing.md: 3: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##  Heading 2 {MD019}\"]\n" +
      "./test/atx_heading_spacing.md: 5: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##   Heading 3 {MD019}\"]\n" +
      "./test/first_heading_bad_atx.md: 1: MD002/first-heading-h1" +
      " First heading should be a top level heading" +
      " [Expected: h1; Actual: h2]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.resultFormattingV2 = function resultFormattingV2(test) {
  test.expect(3);
  const options = {
    "strings": {
      "truncate":
        "#  Multiple spaces inside hashes on closed atx style heading  #\n"
    },
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD002": true,
      "MD041": false
    }
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "truncate": [
        { "lineNumber": 1,
          "ruleNames": [ "MD021", "no-multiple-space-closed-atx" ],
          "ruleDescription":
            "Multiple spaces inside hashes on closed atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md021`,
          "errorDetail": null,
          "errorContext": "#  Multiple spa...tyle heading  #",
          "errorRange": [ 1, 4 ] }
      ],
      "./test/atx_heading_spacing.md": [
        { "lineNumber": 3,
          "ruleNames": [ "MD002", "first-heading-h1", "first-header-h1" ],
          "ruleDescription": "First heading should be a top level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md002`,
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null },
        { "lineNumber": 1,
          "ruleNames": [ "MD018", "no-missing-space-atx" ],
          "ruleDescription": "No space after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md018`,
          "errorDetail": null,
          "errorContext": "#Heading 1 {MD018}",
          "errorRange": [ 1, 2 ] },
        { "lineNumber": 3,
          "ruleNames": [ "MD019", "no-multiple-space-atx" ],
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md019`,
          "errorDetail": null,
          "errorContext": "##  Heading 2 {MD019}",
          "errorRange": [ 1, 5 ] },
        { "lineNumber": 5,
          "ruleNames": [ "MD019", "no-multiple-space-atx" ],
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md019`,
          "errorDetail": null,
          "errorContext": "##   Heading 3 {MD019}",
          "errorRange": [ 1, 6 ] }
      ],
      "./test/first_heading_bad_atx.md": [
        { "lineNumber": 1,
          "ruleNames": [ "MD002", "first-heading-h1", "first-header-h1" ],
          "ruleDescription": "First heading should be a top level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md002`,
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style heading" +
      " [Context: \"#  Multiple spa...tyle heading  #\"]\n" +
      "./test/atx_heading_spacing.md: 3:" +
      " MD002/first-heading-h1/first-header-h1" +
      " First heading should be a top level heading" +
      " [Expected: h1; Actual: h2]\n" +
      "./test/atx_heading_spacing.md: 1: MD018/no-missing-space-atx" +
      " No space after hash on atx style heading" +
      " [Context: \"#Heading 1 {MD018}\"]\n" +
      "./test/atx_heading_spacing.md: 3: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##  Heading 2 {MD019}\"]\n" +
      "./test/atx_heading_spacing.md: 5: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##   Heading 3 {MD019}\"]\n" +
      "./test/first_heading_bad_atx.md: 1:" +
      " MD002/first-heading-h1/first-header-h1" +
      " First heading should be a top level heading" +
      " [Expected: h1; Actual: h2]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.resultFormattingV3 = function resultFormattingV3(test) {
  test.expect(3);
  const options = {
    "strings": {
      "input":
        "# Heading   \n" +
        "\n" +
        "Text\ttext\t\ttext"
    },
    "resultVersion": 3
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "input": [
        {
          "lineNumber": 1,
          "ruleNames": [ "MD009", "no-trailing-spaces" ],
          "ruleDescription": "Trailing spaces",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md009`,
          "errorDetail": "Expected: 0 or 2; Actual: 3",
          "errorContext": null,
          "errorRange": [ 10, 3 ],
          "fixInfo": {
            "editColumn": 10,
            "deleteCount": 3
          }
        },
        {
          "lineNumber": 3,
          "ruleNames": [ "MD010", "no-hard-tabs" ],
          "ruleDescription": "Hard tabs",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md010`,
          "errorDetail": "Column: 5",
          "errorContext": null,
          "errorRange": [ 5, 1 ],
          "fixInfo": {
            "editColumn": 5,
            "deleteCount": 1,
            "insertText": " "
          }
        },
        {
          "lineNumber": 3,
          "ruleNames": [ "MD010", "no-hard-tabs" ],
          "ruleDescription": "Hard tabs",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md010`,
          "errorDetail": "Column: 10",
          "errorContext": null,
          "errorRange": [ 10, 2 ],
          "fixInfo": {
            "editColumn": 10,
            "deleteCount": 2,
            "insertText": "  "
          }
        },
        {
          "lineNumber": 3,
          "ruleNames": [ "MD047", "single-trailing-newline" ],
          "ruleDescription": "Files should end with a single newline character",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md047`,
          "errorDetail": null,
          "errorContext": null,
          "errorRange": [ 15, 1 ],
          "fixInfo": {
            "insertText": "\n",
            "editColumn": 16
          }
        }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "input: 1: MD009/no-trailing-spaces" +
      " Trailing spaces [Expected: 0 or 2; Actual: 3]\n" +
      "input: 3: MD010/no-hard-tabs" +
      " Hard tabs [Column: 5]\n" +
      "input: 3: MD010/no-hard-tabs" +
      " Hard tabs [Column: 10]\n" +
      "input: 3: MD047/single-trailing-newline" +
      " Files should end with a single newline character";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.onePerLineResultVersion0 =
  function onePerLineResultVersion0(test) {
    test.expect(2);
    const options = {
      "strings": {
        "input": "# Heading\theading\t\theading\n"
      },
      "resultVersion": 0
    };
    markdownlint(options, function callback(err, actualResult) {
      test.ifError(err);
      const expectedResult = {
        "input": {
          "MD010": [ 1 ]
        }
      };
      test.deepEqual(actualResult, expectedResult, "Undetected issues.");
      test.done();
    });
  };

module.exports.onePerLineResultVersion1 =
  function onePerLineResultVersion1(test) {
    test.expect(2);
    const options = {
      "strings": {
        "input": "# Heading\theading\t\theading\n"
      },
      "resultVersion": 1
    };
    markdownlint(options, function callback(err, actualResult) {
      test.ifError(err);
      const expectedResult = {
        "input": [
          {
            "lineNumber": 1,
            "ruleName": "MD010",
            "ruleAlias": "no-hard-tabs",
            "ruleDescription": "Hard tabs",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/Rules.md#md010`,
            "errorDetail": "Column: 10",
            "errorContext": null,
            "errorRange": [ 10, 1 ]
          }
        ]
      };
      test.deepEqual(actualResult, expectedResult, "Undetected issues.");
      test.done();
    });
  };

module.exports.onePerLineResultVersion2 =
  function onePerLineResultVersion2(test) {
    test.expect(2);
    const options = {
      "strings": {
        "input": "# Heading\theading\t\theading\n"
      },
      "resultVersion": 2
    };
    markdownlint(options, function callback(err, actualResult) {
      test.ifError(err);
      const expectedResult = {
        "input": [
          {
            "lineNumber": 1,
            "ruleNames": [ "MD010", "no-hard-tabs" ],
            "ruleDescription": "Hard tabs",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/Rules.md#md010`,
            "errorDetail": "Column: 10",
            "errorContext": null,
            "errorRange": [ 10, 1 ]
          }
        ]
      };
      test.deepEqual(actualResult, expectedResult, "Undetected issues.");
      test.done();
    });
  };

module.exports.manyPerLineResultVersion3 =
  function manyPerLineResultVersion3(test) {
    test.expect(2);
    const options = {
      "strings": {
        "input": "# Heading\theading\t\theading\n"
      },
      "resultVersion": 3
    };
    markdownlint(options, function callback(err, actualResult) {
      test.ifError(err);
      const expectedResult = {
        "input": [
          {
            "lineNumber": 1,
            "ruleNames": [ "MD010", "no-hard-tabs" ],
            "ruleDescription": "Hard tabs",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/Rules.md#md010`,
            "errorDetail": "Column: 10",
            "errorContext": null,
            "errorRange": [ 10, 1 ],
            "fixInfo": {
              "editColumn": 10,
              "deleteCount": 1,
              "insertText": " "
            }
          },
          {
            "lineNumber": 1,
            "ruleNames": [ "MD010", "no-hard-tabs" ],
            "ruleDescription": "Hard tabs",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/Rules.md#md010`,
            "errorDetail": "Column: 18",
            "errorContext": null,
            "errorRange": [ 18, 2 ],
            "fixInfo": {
              "editColumn": 18,
              "deleteCount": 2,
              "insertText": "  "
            }
          }
        ]
      };
      test.deepEqual(actualResult, expectedResult, "Undetected issues.");
      test.done();
    });
  };

module.exports.stringInputLineEndings = function stringInputLineEndings(test) {
  test.expect(2);
  const options = {
    "strings": {
      "cr": "One\rTwo\r#Three\n",
      "lf": "One\nTwo\n#Three\n",
      "crlf": "One\r\nTwo\r\n#Three\n",
      "mixed": "One\rTwo\n#Three\n"
    },
    "config": defaultConfig,
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "cr": { "MD018": [ 3 ] },
      "lf": { "MD018": [ 3 ] },
      "crlf": { "MD018": [ 3 ] },
      "mixed": { "MD018": [ 3 ] }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.inputOnlyNewline = function inputOnlyNewline(test) {
  test.expect(2);
  const options = {
    "strings": {
      "cr": "\r",
      "lf": "\n",
      "crlf": "\r\n"
    },
    "config": {
      "default": false
    }
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "cr": [],
      "lf": [],
      "crlf": []
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.defaultTrue = function defaultTrue(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "default": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ],
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.defaultFalse = function defaultFalse(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "default": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {},
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.defaultUndefined = function defaultUndefined(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {},
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ],
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.disableRules = function disableRules(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD002": false,
      "default": true,
      "MD019": false,
      "first-line-h1": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableRules = function enableRules(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD002": true,
      "default": false,
      "no-multiple-space-atx": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableRulesMixedCase = function enableRulesMixedCase(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "Md002": true,
      "DeFaUlT": false,
      "nO-mUlTiPlE-sPaCe-AtX": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.disableTag = function disableTag(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "default": true,
      "spaces": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableTag = function enableTag(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "default": false,
      "spaces": true,
      "notatag": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableTagMixedCase = function enableTagMixedCase(test) {
  test.expect(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "DeFaUlT": false,
      "SpAcEs": true,
      "NoTaTaG": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.styleFiles = function styleFiles(test) {
  test.expect(4);
  fs.readdir("./style", function readdir(err, files) {
    test.ifError(err);
    files.forEach(function forFile(file) {
      test.ok(require(path.join("../style", file)), "Unable to load/parse.");
    });
    test.done();
  });
};

module.exports.styleAll = function styleAll(test) {
  test.expect(2);
  const options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/all.json"),
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/break-all-the-rules.md": {
        "MD001": [ 3 ],
        "MD003": [ 5, 31 ],
        "MD004": [ 8 ],
        "MD005": [ 12 ],
        "MD006": [ 8 ],
        "MD007": [ 8, 11 ],
        "MD009": [ 14 ],
        "MD010": [ 14 ],
        "MD011": [ 16 ],
        "MD012": [ 18 ],
        "MD013": [ 21 ],
        "MD014": [ 23 ],
        "MD018": [ 25 ],
        "MD019": [ 27 ],
        "MD020": [ 29 ],
        "MD021": [ 31 ],
        "MD022": [ 82 ],
        "MD023": [ 40 ],
        "MD024": [ 35 ],
        "MD026": [ 40 ],
        "MD027": [ 42 ],
        "MD028": [ 43 ],
        "MD029": [ 47 ],
        "MD030": [ 8 ],
        "MD031": [ 50 ],
        "MD032": [ 7, 8, 51 ],
        "MD033": [ 55 ],
        "MD034": [ 57 ],
        "MD035": [ 61 ],
        "MD036": [ 65 ],
        "MD037": [ 67 ],
        "MD038": [ 69 ],
        "MD039": [ 71 ],
        "MD040": [ 73 ],
        "MD041": [ 1 ],
        "MD042": [ 77 ],
        "MD045": [ 81 ],
        "MD046": [ 49, 73 ],
        "MD047": [ 84 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.styleRelaxed = function styleRelaxed(test) {
  test.expect(2);
  const options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/relaxed.json"),
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/break-all-the-rules.md": {
        "MD001": [ 3 ],
        "MD003": [ 5, 31 ],
        "MD004": [ 8 ],
        "MD005": [ 12 ],
        "MD011": [ 16 ],
        "MD014": [ 23 ],
        "MD018": [ 25 ],
        "MD019": [ 27 ],
        "MD020": [ 29 ],
        "MD021": [ 31 ],
        "MD022": [ 82 ],
        "MD023": [ 40 ],
        "MD024": [ 35 ],
        "MD026": [ 40 ],
        "MD029": [ 47 ],
        "MD031": [ 50 ],
        "MD032": [ 7, 8, 51 ],
        "MD035": [ 61 ],
        "MD036": [ 65 ],
        "MD042": [ 77 ],
        "MD045": [ 81 ],
        "MD046": [ 49, 73 ],
        "MD047": [ 84 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.nullFrontMatter = function nullFrontMatter(test) {
  test.expect(2);
  markdownlint({
    "strings": {
      "content": "---\n\t\n---\n# Heading\n"
    },
    "frontMatter": null,
    "config": {
      "default": false,
      "MD010": true
    },
    "resultVersion": 0
  }, function callback(err, result) {
    test.ifError(err);
    const expectedResult = {
      "content": { "MD010": [ 2 ] }
    };
    test.deepEqual(result, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.customFrontMatter = function customFrontMatter(test) {
  test.expect(2);
  markdownlint({
    "strings": {
      "content": "<head>\n\t\n</head>\n# Heading\n"
    },
    "frontMatter": /<head>[^]*<\/head>/,
    "config": {
      "default": false,
      "MD010": true
    }
  }, function callback(err, result) {
    test.ifError(err);
    const expectedResult = {
      "content": []
    };
    test.deepEqual(result, expectedResult, "Did not get empty results.");
    test.done();
  });
};

module.exports.noInlineConfig = function noInlineConfig(test) {
  test.expect(2);
  markdownlint({
    "strings": {
      "content": [
        "# Heading",
        "",
        "\tTab",
        "",
        "<!-- markdownlint-disable-->",
        "",
        "\tTab",
        "",
        "<!-- markdownlint-enable-->",
        "",
        "\tTab\n"
      ].join("\n")
    },
    "noInlineConfig": true,
    "resultVersion": 0
  }, function callback(err, result) {
    test.ifError(err);
    const expectedResult = {
      "content": {
        "MD010": [ 3, 7, 11 ]
      }
    };
    test.deepEqual(result, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.readmeHeadings = function readmeHeadings(test) {
  test.expect(2);
  markdownlint({
    "files": "README.md",
    "noInlineConfig": true,
    "config": {
      "default": false,
      "MD013": {
        "line_length": 150
      },
      "MD043": {
        "headings": [
          "# markdownlint",
          "## Install",
          "## Overview",
          "### Related",
          "## Demonstration",
          "## Rules / Aliases",
          "## Tags",
          "## Configuration",
          "## API",
          "### Linting",
          "#### options",
          "##### options.customRules",
          "##### options.files",
          "##### options.strings",
          "##### options.config",
          "##### options.frontMatter",
          "##### options.handleRuleFailures",
          "##### options.noInlineConfig",
          "##### options.resultVersion",
          "##### options.markdownItPlugins",
          "#### callback",
          "#### result",
          "### Config",
          "#### file",
          "#### parsers",
          "#### callback",
          "#### result",
          "## Usage",
          "## Browser",
          "## Examples",
          "## Contributing",
          "## History"
        ]
      }
    }
  }, function callback(err, result) {
    test.ifError(err);
    const expected = { "README.md": [] };
    test.deepEqual(result, expected, "Unexpected issues.");
    test.done();
  });
};

module.exports.filesArrayNotModified = function filesArrayNotModified(test) {
  test.expect(2);
  const files = [
    "./test/atx_heading_spacing.md",
    "./test/first_heading_bad_atx.md"
  ];
  const expectedFiles = files.slice();
  markdownlint({ "files": files }, function callback(err) {
    test.ifError(err);
    test.deepEqual(files, expectedFiles, "Files modified.");
    test.done();
  });
};

module.exports.filesArrayAsString = function filesArrayAsString(test) {
  test.expect(2);
  markdownlint({
    "files": "README.md",
    "noInlineConfig": true,
    "config": {
      "MD013": { "line_length": 150 },
      "MD024": false
    }
  }, function callback(err, actual) {
    test.ifError(err);
    const expected = { "README.md": [] };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.done();
  });
};

module.exports.missingOptions = function missingOptions(test) {
  test.expect(2);
  markdownlint(null, function callback(err, result) {
    test.ifError(err);
    test.deepEqual(result, {}, "Did not get empty result for missing options.");
    test.done();
  });
};

module.exports.missingFilesAndStrings = function missingFilesAndStrings(test) {
  test.expect(2);
  markdownlint({}, function callback(err, result) {
    test.ifError(err);
    test.ok(result, "Did not get result for missing files/strings.");
    test.done();
  });
};

module.exports.missingCallback = function missingCallback(test) {
  test.expect(0);
  markdownlint();
  test.done();
};

module.exports.badFile = function badFile(test) {
  test.expect(4);
  markdownlint({
    "files": [ "./badFile" ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for bad file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    test.ok(!result, "Got result for bad file.");
    test.done();
  });
};

module.exports.badFileSync = function badFileSync(test) {
  test.expect(4);
  test.throws(function badFileCall() {
    markdownlint.sync({
      "files": [ "./badFile" ]
    });
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    return true;
  }, "Did not get exception for bad file.");
  test.done();
};

module.exports.missingStringValue = function missingStringValue(test) {
  test.expect(2);
  markdownlint({
    "strings": {
      "undefined": undefined,
      "null": null,
      "empty": ""
    },
    "config": defaultConfig
  }, function callback(err, result) {
    test.ifError(err);
    const expectedResult = {
      "undefined": [],
      "null": [],
      "empty": []
    };
    test.deepEqual(result, expectedResult, "Did not get empty results.");
    test.done();
  });
};

module.exports.readme = function readme(test) {
  test.expect(113);
  const tagToRules = {};
  rules.forEach(function forRule(rule) {
    rule.tags.forEach(function forTag(tag) {
      const tagRules = tagToRules[tag] || [];
      tagRules.push(rule.names[0]);
      tagToRules[tag] = tagRules;
    });
  });
  fs.readFile("README.md", helpers.utf8Encoding,
    function readFile(err, contents) {
      test.ifError(err);
      const rulesLeft = rules.slice();
      let seenRelated = false;
      let seenRules = false;
      let inRules = false;
      let seenTags = false;
      let inTags = false;
      md.parse(contents, {}).forEach(function forToken(token) {
        if (token.type === "bullet_list_open") {
          if (!seenRelated) {
            seenRelated = true;
          } else if (seenRelated && !seenRules) {
            seenRules = true;
            inRules = true;
          } else if (seenRelated && seenRules && !seenTags) {
            seenTags = true;
            inTags = true;
          }
        } else if (token.type === "bullet_list_close") {
          inRules = false;
          inTags = false;
        } else if (token.type === "inline") {
          if (inRules) {
            const rule = rulesLeft.shift();
            test.ok(rule,
              "Missing rule implementation for " + token.content + ".");
            if (rule) {
              const ruleName = rule.names[0];
              const ruleAliases = rule.names.slice(1);
              let expected = "**[" + ruleName + "](doc/Rules.md#" +
                ruleName.toLowerCase() + ")** *" +
                ruleAliases.join("/") + "* - " + rule.description;
              if (deprecatedRuleNames.includes(ruleName)) {
                expected = "~~" + expected + "~~";
              }
              test.equal(token.content, expected, "Rule mismatch.");
            }
          } else if (inTags) {
            const parts =
              token.content.replace(/\*\*/g, "").split(/ - |, |,\n/);
            const tag = parts.shift();
            test.deepEqual(parts, tagToRules[tag] || [],
              "Rule mismatch for tag " + tag + ".");
            delete tagToRules[tag];
          }
        }
      });
      const ruleLeft = rulesLeft.shift();
      test.ok(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || "[NO RULE]").toString() + ".");
      const tagLeft = Object.keys(tagToRules).shift();
      test.ok(!tagLeft, "Undocumented tag " + tagLeft + ".");
      test.done();
    });
};

module.exports.doc = function doc(test) {
  test.expect(328);
  fs.readFile("doc/Rules.md", helpers.utf8Encoding,
    function readFile(err, contents) {
      test.ifError(err);
      const rulesLeft = rules.slice();
      let inHeading = false;
      let rule = null;
      let ruleHasTags = true;
      let ruleHasAliases = true;
      let ruleUsesParams = null;
      const tagAliasParameterRe = /, |: | /;
      function testTagsAliasesParams(r) {
        r = r || "[NO RULE]";
        test.ok(ruleHasTags,
          "Missing tags for rule " + r.names + ".");
        test.ok(ruleHasAliases,
          "Missing aliases for rule " + r.names + ".");
        test.ok(!ruleUsesParams,
          "Missing parameters for rule " + r.names + ".");
      }
      md.parse(contents, {}).forEach(function forToken(token) {
        if ((token.type === "heading_open") && (token.tag === "h2")) {
          inHeading = true;
        } else if (token.type === "heading_close") {
          inHeading = false;
        } else if (token.type === "inline") {
          if (inHeading) {
            testTagsAliasesParams(rule);
            rule = rulesLeft.shift();
            ruleHasTags = false;
            ruleHasAliases = false;
            test.ok(rule,
              "Missing rule implementation for " + token.content + ".");
            const ruleName = rule.names[0];
            let headingContent = ruleName + " - " + rule.description;
            if (deprecatedRuleNames.includes(ruleName)) {
              headingContent = "~~" + headingContent + "~~";
            }
            test.equal(token.content,
              headingContent,
              "Rule mismatch.");
            ruleUsesParams = rule.function.toString()
              .match(/params\.config\.[_a-z]*/gi);
            if (ruleUsesParams) {
              ruleUsesParams = ruleUsesParams.map(function forUse(use) {
                return use.split(".").pop();
              });
            }
          } else if (/^Tags: /.test(token.content) && rule) {
            test.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.tags, "Tag mismatch for rule " + rule.names + ".");
            ruleHasTags = true;
          } else if (/^Aliases: /.test(token.content) && rule) {
            test.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.names.slice(1),
              "Alias mismatch for rule " + rule.names + ".");
            ruleHasAliases = true;
          } else if (/^Parameters: /.test(token.content) && rule) {
            let inDetails = false;
            const parameters = token.content.split(tagAliasParameterRe)
              .slice(1)
              .filter(function forPart(part) {
                inDetails = inDetails || (part[0] === "(");
                return !inDetails;
              });
            test.deepEqual(parameters, ruleUsesParams,
              "Missing parameter for rule " + rule.names);
            ruleUsesParams = null;
          }
        }
      });
      const ruleLeft = rulesLeft.shift();
      test.ok(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || { "names": "[NO RULE]" }).names + ".");
      if (rule) {
        testTagsAliasesParams(rule);
      }
      test.done();
    });
};

module.exports.validateConfigSchema = function validateConfigSchema(test) {
  const jsonFileRe = /\.json$/i;
  const resultsFileRe = /\.results\.json$/i;
  const testDirectory = __dirname;
  const testFiles = fs.readdirSync(testDirectory);
  testFiles.filter(function filterFile(file) {
    return jsonFileRe.test(file) && !resultsFileRe.test(file);
  }).forEach(function forFile(file) {
    const data = fs.readFileSync(path.join(testDirectory, file));
    test.ok(
      tv4.validate(JSON.parse(data), configSchema),
      file + "\n" + JSON.stringify(tv4.error, null, 2));
  });
  test.done();
};

module.exports.clearHtmlCommentTextValid =
function clearHtmlCommentTextValid(test) {
  test.expect(1);
  const validComments = [
    "<!-- text -->",
    "<!--text-->",
    "<!-- -->",
    "<!---->",
    "<!---text-->",
    "<!--text-text-->",
    "<!--- -->",
    "<!--",
    "-->",
    "<!--",
    "",
    "-->",
    "<!--",
    "",
    "",
    "-->",
    "<!--",
    "",
    " text ",
    "",
    "-->",
    "<!--text",
    "",
    "text-->",
    "text<!--text-->text",
    "text<!--",
    "-->text",
    "text<!--",
    "text",
    "-->text",
    "<!--text--><!--text-->",
    "text<!--text-->text<!--text-->text",
    "<!--",
    "text"
  ];
  const validResult = [
    "<!--      -->",
    "<!--    -->",
    "<!-- -->",
    "<!---->",
    "<!--     -->",
    "<!--         -->",
    "<!--  -->",
    "<!--",
    "-->",
    "<!--",
    "",
    "-->",
    "<!--",
    "",
    "",
    "-->",
    "<!--",
    "",
    "     \\",
    "",
    "-->",
    "<!--   \\",
    "",
    "    -->",
    "text<!--    -->text",
    "text<!--",
    "-->text",
    "text<!--",
    "   \\",
    "-->text",
    "<!--    --><!--    -->",
    "text<!--    -->text<!--    -->text",
    "<!--",
    "    \\",
    ""
  ];
  const actual = helpers.clearHtmlCommentText(validComments.join("\n"));
  const expected = validResult.join("\n");
  test.equal(actual, expected);
  test.done();
};

module.exports.clearHtmlCommentTextInvalid =
function clearHtmlCommentTextInvalid(test) {
  test.expect(1);
  const invalidComments = [
    "<!>",
    "<!->",
    "<!-->",
    "<!--->",
    "<!-->-->",
    "<!--->-->",
    "<!----->",
    "<!------>",
    "<!-- -- -->",
    "<!-->-->",
    "<!--> -->",
    "<!--->-->",
    "<!-->text-->",
    "<!--->text-->",
    "<!--text--->",
    "<!--te--xt-->"
  ];
  const actual = helpers.clearHtmlCommentText(invalidComments.join("\n"));
  const expected = invalidComments.join("\n");
  test.equal(actual, expected);
  test.done();
};

module.exports.clearHtmlCommentTextNonGreedy =
function clearHtmlCommentTextNonGreedy(test) {
  test.expect(1);
  const nonGreedyComments = [
    "<!-- text --> -->",
    "<!---text --> -->",
    "<!--t--> -->",
    "<!----> -->"
  ];
  const nonGreedyResult = [
    "<!--      --> -->",
    "<!--      --> -->",
    "<!-- --> -->",
    "<!----> -->"
  ];
  const actual = helpers.clearHtmlCommentText(nonGreedyComments.join("\n"));
  const expected = nonGreedyResult.join("\n");
  test.equal(actual, expected);
  test.done();
};

module.exports.clearHtmlCommentTextEmbedded =
function clearHtmlCommentTextEmbedded(test) {
  test.expect(1);
  const embeddedComments = [
    "text<!--text-->text",
    "<!-- markdownlint-disable MD010 -->",
    "text<!--text-->text",
    "text<!-- markdownlint-disable MD010 -->text",
    "text<!--text-->text"
  ];
  const embeddedResult = [
    "text<!--    -->text",
    "<!-- markdownlint-disable MD010 -->",
    "text<!--    -->text",
    "text<!-- markdownlint-disable MD010 -->text",
    "text<!--    -->text"
  ];
  const actual = helpers.clearHtmlCommentText(embeddedComments.join("\n"));
  const expected = embeddedResult.join("\n");
  test.equal(actual, expected);
  test.done();
};

module.exports.unescapeMarkdown = function unescapeMarkdown(test) {
  test.expect(7);
  // Test cases from https://spec.commonmark.org/0.29/#backslash-escapes
  const testCases = [
    [
      "\\!\\\"\\#\\$\\%\\&\\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;" +
        "\\<\\=\\>\\?\\@\\[\\\\\\]\\^\\_\\`\\{\\|\\}\\~",
      "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    ],
    [
      "\\→\\A\\a\\ \\3\\φ\\«",
      "\\→\\A\\a\\ \\3\\φ\\«"
    ],
    [
      `\\*not emphasized*
\\<br/> not a tag
\\[not a link](/foo)
\\\`not code\`
1\\. not a list
\\* not a list
\\# not a heading
\\[foo]: /url "not a reference"
\\&ouml; not a character entity`,
      `*not emphasized*
<br/> not a tag
[not a link](/foo)
\`not code\`
1. not a list
* not a list
# not a heading
[foo]: /url "not a reference"
&ouml; not a character entity`
    ],
    [
      "\\\\*emphasis*",
      "\\*emphasis*"
    ],
    [
      `foo\\
bar`,
      `foo\\
bar`
    ],
    [
      "Text \\<",
      "Text _",
      "_"
    ],
    [
      "Text \\\\<",
      "Text _<",
      "_"
    ]
  ];
  testCases.forEach(function forTestCase(testCase) {
    const [ markdown, expected, replacement ] = testCase;
    const actual = helpers.unescapeMarkdown(markdown, replacement);
    test.equal(actual, expected);
  });
  test.done();
};

module.exports.isBlankLine = function isBlankLine(test) {
  test.expect(25);
  const blankLines = [
    null,
    "",
    " ",
    "  ",
    "\t\t\t",
    "\r",
    "\n",
    "\t\r\n",
    " <!-- text --> ",
    "<!--text-->",
    "<!---->",
    "<!-- text -->\t<!-- text -->",
    ">",
    "> ",
    "> > > \t",
    "> <!--text-->",
    ">><!--text-->"
  ];
  blankLines.forEach((line) => test.ok(helpers.isBlankLine(line), line));
  const nonBlankLines = [
    "text",
    " text ",
    ".",
    "> .",
    "<!--text--> text",
    "<!--->",
    "<!--",
    "-->"
  ];
  nonBlankLines.forEach((line) => test.ok(!helpers.isBlankLine(line), line));
  test.done();
};

module.exports.includesSorted = function includesSorted(test) {
  test.expect(154);
  const inputs = [
    [ ],
    [ 8 ],
    [ 7, 11 ],
    [ 0, 1, 2, 3, 5, 8, 13 ],
    [ 2, 3, 5, 7, 11, 13, 17, 19 ],
    [ 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 ],
    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]
  ];
  inputs.forEach((input) => {
    for (let i = 0; i <= 21; i++) {
      test.equal(helpers.includesSorted(input, i), input.includes(i));
    }
  });
  test.done();
};

module.exports.forEachInlineCodeSpan = function forEachInlineCodeSpan(test) {
  test.expect(94);
  const testCases =
    [
      [
        "`code`",
        [ [ "code", 0, 1, 1 ] ]
      ],
      [
        "text `code` text",
        [ [ "code", 0, 6, 1 ] ]
      ],
      [
        "text `code` text `edoc`",
        [
          [ "code", 0, 6, 1 ],
          [ "edoc", 0, 18, 1 ]
        ]
      ],
      [
        "text `code` text `edoc` text",
        [
          [ "code", 0, 6, 1 ],
          [ "edoc", 0, 18, 1 ]
        ]
      ],
      [
        "text ``code`code`` text",
        [ [ "code`code", 0, 7, 2 ] ]
      ],
      [
        "`code `` code`",
        [ [ "code `` code", 0, 1, 1 ] ]
      ],
      [
        "`code\\`text`",
        [ [ "code\\", 0, 1, 1 ] ]
      ],
      [
        "``\ncode\n``",
        [ [ "\ncode\n", 0, 2, 2 ] ]
      ],
      [
        "text\n`code`\ntext",
        [ [ "code", 1, 1, 1 ] ]
      ],
      [
        "text\ntext\n`code`\ntext\n`edoc`\ntext",
        [
          [ "code", 2, 1, 1 ],
          [ "edoc", 4, 1, 1 ]
        ]
      ],
      [
        "text `code\nedoc` text",
        [ [ "code\nedoc", 0, 6, 1 ] ]
      ],
      [
        "> text `code` text",
        [ [ "code", 0, 8, 1 ] ]
      ],
      [
        "> text\n> `code`\n> text",
        [ [ "code", 1, 3, 1 ] ]
      ],
      [
        "> text\n> `code\n> edoc`\n> text",
        [ [ "code\n> edoc", 1, 3, 1 ] ]
      ],
      [
        "```text``",
        []
      ],
      [
        "text `text text",
        []
      ],
      [
        "`text``code``",
        [ [ "code", 0, 7, 2 ] ]
      ],
      [
        "text \\` text `code`",
        [ [ "code", 0, 14, 1 ] ]
      ]
    ];
  testCases.forEach((testCase) => {
    const [ input, expecteds ] = testCase;
    helpers.forEachInlineCodeSpan(input, (code, line, column, ticks) => {
      const [ expectedCode, expectedLine, expectedColumn, expectedTicks ] =
        expecteds.shift();
      test.equal(code, expectedCode, input);
      test.equal(line, expectedLine, input);
      test.equal(column, expectedColumn, input);
      test.equal(ticks, expectedTicks, input);
    });
    test.equal(expecteds.length, 0, "length");
  });
  test.done();
};

module.exports.getPreferredLineEnding = function getPreferredLineEnding(test) {
  test.expect(17);
  const testCases = [
    [ "", os.EOL ],
    [ "\r", "\r" ],
    [ "\n", "\n" ],
    [ "\r\n", "\r\n" ],
    [ "t\rt\nt", "\n" ],
    [ "t\nt\rt", "\n" ],
    [ "t\r\nt\nt", "\n" ],
    [ "t\nt\r\nt", "\n" ],
    [ "t\r\nt\rt", "\r\n" ],
    [ "t\rt\r\nt", "\r\n" ],
    [ "t\r\nt\rt\nt", "\n" ],
    [ "t\r\nt\r\nt\r\nt", "\r\n" ],
    [ "t\nt\nt\nt", "\n" ],
    [ "t\rt\rt\rt", "\r" ],
    [ "t\r\nt\nt\r\nt", "\r\n" ],
    [ "t\nt\r\nt\nt", "\n" ],
    [ "t\rt\t\rt", "\r" ]
  ];
  testCases.forEach((testCase) => {
    const [ input, expected ] = testCase;
    const actual = helpers.getPreferredLineEnding(input);
    test.equal(actual, expected, "Incorrect line ending returned.");
  });
  test.done();
};

module.exports.applyFix = function applyFix(test) {
  test.expect(4);
  const testCases = [
    [
      "Hello world.",
      {
        "editColumn": 12,
        "deleteCount": 1
      },
      undefined,
      "Hello world"
    ],
    [
      "Hello world.",
      {
        "editColumn": 13,
        "insertText": "\n"
      },
      undefined,
      "Hello world.\n"
    ],
    [
      "Hello world.",
      {
        "editColumn": 13,
        "insertText": "\n"
      },
      "\n",
      "Hello world.\n"
    ],
    [
      "Hello world.",
      {
        "editColumn": 13,
        "insertText": "\n"
      },
      "\r\n",
      "Hello world.\r\n"
    ]
  ];
  testCases.forEach((testCase) => {
    const [ line, fixInfo, lineEnding, expected ] = testCase;
    const actual = helpers.applyFix(line, fixInfo, lineEnding);
    test.equal(actual, expected, "Incorrect fix applied.");
  });
  test.done();
};

module.exports.applyFixes = function applyFixes(test) {
  test.expect(28);
  const testCases = [
    [
      "Hello world.",
      [],
      "Hello world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {}
        }
      ],
      "Hello world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "insertText": "Very "
          }
        }
      ],
      "Very Hello world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 7,
            "insertText": "big "
          }
        }
      ],
      "Hello big world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "deleteCount": 6
          }
        }
      ],
      "world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 7,
            "deleteCount": 5,
            "insertText": "there"
          }
        }
      ],
      "Hello there."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 12,
            "deleteCount": 1
          }
        },
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 6,
            "deleteCount": 1
          }
        }
      ],
      "Helloworld"
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 13,
            "insertText": " Hi."
          }
        }
      ],
      "Hello world. Hi."
    ],
    [
      "Hello\nworld",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "deleteCount": -1
          }
        }
      ],
      "world"
    ],
    [
      "Hello\nworld",
      [
        {
          "lineNumber": 2,
          "fixInfo": {
            "deleteCount": -1
          }
        }
      ],
      "Hello"
    ],
    [
      "Hello\nworld",
      [
        {
          "lineNumber": 2,
          "fixInfo": {
            "lineNumber": 1,
            "deleteCount": -1
          }
        }
      ],
      "world"
    ],
    [
      "Hello\nworld",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "lineNumber": 2,
            "deleteCount": -1
          }
        }
      ],
      "Hello"
    ],
    [
      "Hello world",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 4,
            "deleteCount": 1
          }
        },
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 10,
            "deleteCount": 1
          }
        }
      ],
      "Helo word"
    ],
    [
      "Hello world",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 10,
            "deleteCount": 1
          }
        },
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 4,
            "deleteCount": 1
          }
        }
      ],
      "Helo word"
    ],
    [
      "Hello\nworld",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "deleteCount": -1
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "Big "
          }
        }
      ],
      "world"
    ],
    [
      "Hello\nworld",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "deleteCount": -1
          }
        },
        {
          "fixInfo": {
            "lineNumber": 2,
            "deleteCount": -1
          }
        }
      ],
      ""
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "aa"
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "b"
          }
        }
      ],
      "aaHello world"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "a"
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "bb"
          }
        }
      ],
      "bbHello world"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 6,
            "insertText": " big"
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 1
          }
        }
      ],
      "Hello big orld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 8,
            "deleteCount": 2
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 2
          }
        }
      ],
      "Hello wld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 2
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 8,
            "deleteCount": 2
          }
        }
      ],
      "Hello wld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 1,
            "insertText": "z"
          }
        }
      ],
      "Hello zorld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 1
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "insertText": "z"
          }
        }
      ],
      "Hello zorld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "insertText": "z"
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 1
          }
        }
      ],
      "Hello zorld"
    ],
    [
      "Hello\nworld\nhello\rworld",
      [
        {
          "fixInfo": {
            "lineNumber": 4,
            "editColumn": 6,
            "insertText": "\n"
          }
        }
      ],
      "Hello\nworld\nhello\nworld\n"
    ],
    [
      "Hello\r\nworld\r\nhello\nworld",
      [
        {
          "fixInfo": {
            "lineNumber": 4,
            "editColumn": 6,
            "insertText": "\n"
          }
        }
      ],
      "Hello\r\nworld\r\nhello\r\nworld\r\n"
    ],
    [
      "Hello\rworld\rhello\nworld",
      [
        {
          "fixInfo": {
            "lineNumber": 4,
            "editColumn": 6,
            "insertText": "\n"
          }
        }
      ],
      "Hello\rworld\rhello\rworld\r"
    ],
    [
      "Hello\r\nworld",
      [
        {
          "lineNumber": 2,
          "fixInfo": {
            "editColumn": 6,
            "insertText": "\n\n"
          }
        }
      ],
      "Hello\r\nworld\r\n\r\n"
    ]
  ];
  testCases.forEach((testCase) => {
    const [ input, errors, expected ] = testCase;
    const actual = helpers.applyFixes(input, errors);
    test.equal(actual, expected, "Incorrect fix applied.");
  });
  test.done();
};

module.exports.configSingle = function configSingle(test) {
  test.expect(2);
  markdownlint.readConfig("./test/config/config-child.json",
    function callback(err, actual) {
      test.ifError(err);
      const expected = require("./config/config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configAbsolute = function configAbsolute(test) {
  test.expect(2);
  markdownlint.readConfig(path.join(__dirname, "config", "config-child.json"),
    function callback(err, actual) {
      test.ifError(err);
      const expected = require("./config/config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configMultiple = function configMultiple(test) {
  test.expect(2);
  markdownlint.readConfig("./test/config/config-grandparent.json",
    function callback(err, actual) {
      test.ifError(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configBadFile = function configBadFile(test) {
  test.expect(4);
  markdownlint.readConfig("./test/config/config-badfile.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad file.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
      test.ok(!result, "Got result for bad file.");
      test.done();
    });
};

module.exports.configBadChildFile = function configBadChildFile(test) {
  test.expect(4);
  markdownlint.readConfig("./test/config/config-badchildfile.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child file.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.equal(err.code, "ENOENT",
        "Error code for bad child file not ENOENT.");
      test.ok(!result, "Got result for bad child file.");
      test.done();
    });
};

module.exports.configBadJson = function configBadJson(test) {
  test.expect(3);
  markdownlint.readConfig("./test/config/config-badjson.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad JSON.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.ok(!result, "Got result for bad JSON.");
      test.done();
    });
};

module.exports.configBadChildJson = function configBadChildJson(test) {
  test.expect(3);
  markdownlint.readConfig("./test/config/config-badchildjson.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child JSON.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.ok(!result, "Got result for bad child JSON.");
      test.done();
    });
};

module.exports.configSingleYaml = function configSingleYaml(test) {
  test.expect(2);
  markdownlint.readConfig(
    "./test/config/config-child.yaml",
    [ require("js-yaml").safeLoad ],
    function callback(err, actual) {
      test.ifError(err);
      const expected = require("./config/config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configMultipleYaml = function configMultipleYaml(test) {
  test.expect(2);
  markdownlint.readConfig(
    "./test/config/config-grandparent.yaml",
    [ require("js-yaml").safeLoad ],
    function callback(err, actual) {
      test.ifError(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configMultipleHybrid = function configMultipleHybrid(test) {
  test.expect(2);
  markdownlint.readConfig(
    "./test/config/config-grandparent-hybrid.yaml",
    [ JSON.parse, require("toml").parse, require("js-yaml").safeLoad ],
    function callback(err, actual) {
      test.ifError(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configBadHybrid = function configBadHybrid(test) {
  test.expect(4);
  markdownlint.readConfig(
    "./test/config/config-badcontent.txt",
    [ JSON.parse, require("toml").parse, require("js-yaml").safeLoad ],
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child JSON.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.ok(err.message.match(
        // eslint-disable-next-line max-len
        /^Unable to parse '[^']*'; Unexpected token \S+ in JSON at position \d+; Expected [^;]+ or end of input but "\S+" found.; end of the stream or a document separator is expected at line \d+, column \d+:[^;]*$/
      ), "Error message unexpected.");
      test.ok(!result, "Got result for bad child JSON.");
      test.done();
    });
};

module.exports.configSingleSync = function configSingleSync(test) {
  test.expect(1);
  const actual = markdownlint.readConfigSync("./test/config/config-child.json");
  const expected = require("./config/config-child.json");
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configAbsoluteSync = function configAbsoluteSync(test) {
  test.expect(1);
  const actual = markdownlint.readConfigSync(
    path.join(__dirname, "config", "config-child.json"));
  const expected = require("./config/config-child.json");
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configMultipleSync = function configMultipleSync(test) {
  test.expect(1);
  const actual =
    markdownlint.readConfigSync("./test/config/config-grandparent.json");
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configBadFileSync = function configBadFileSync(test) {
  test.expect(4);
  test.throws(function badFileCall() {
    markdownlint.readConfigSync("./test/config/config-badfile.json");
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    return true;
  }, "Did not get exception for bad file.");
  test.done();
};

module.exports.configBadChildFileSync = function configBadChildFileSync(test) {
  test.expect(4);
  test.throws(function badChildFileCall() {
    markdownlint.readConfigSync("./test/config/config-badchildfile.json");
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad child file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.code, "ENOENT", "Error code for bad child file not ENOENT.");
    return true;
  }, "Did not get exception for bad child file.");
  test.done();
};

module.exports.configBadJsonSync = function configBadJsonSync(test) {
  test.expect(4);
  test.throws(function badJsonCall() {
    markdownlint.readConfigSync("./test/config/config-badjson.json");
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad JSON.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.ok(err.message.match(
      // eslint-disable-next-line max-len
      /^Unable to parse '[^']*'; Unexpected token \S+ in JSON at position \d+$/
    ), "Error message unexpected.");
    return true;
  }, "Did not get exception for bad JSON.");
  test.done();
};

module.exports.configBadChildJsonSync = function configBadChildJsonSync(test) {
  test.expect(4);
  test.throws(function badChildJsonCall() {
    markdownlint.readConfigSync("./test/config/config-badchildjson.json");
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad child JSON.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.ok(err.message.match(
      // eslint-disable-next-line max-len
      /^Unable to parse '[^']*'; Unexpected token \S+ in JSON at position \d+$/
    ), "Error message unexpected.");
    return true;
  }, "Did not get exception for bad child JSON.");
  test.done();
};

module.exports.configSingleYamlSync = function configSingleYamlSync(test) {
  test.expect(1);
  const actual = markdownlint.readConfigSync(
    "./test/config/config-child.yaml", [ require("js-yaml").safeLoad ]);
  const expected = require("./config/config-child.json");
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configMultipleYamlSync = function configMultipleYamlSync(test) {
  test.expect(1);
  const actual = markdownlint.readConfigSync(
    "./test/config/config-grandparent.yaml", [ require("js-yaml").safeLoad ]);
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configMultipleHybridSync =
function configMultipleHybridSync(test) {
  test.expect(1);
  const actual = markdownlint.readConfigSync(
    "./test/config/config-grandparent-hybrid.yaml",
    [ JSON.parse, require("toml").parse, require("js-yaml").safeLoad ]);
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configBadHybridSync = function configBadHybridSync(test) {
  test.expect(4);
  test.throws(function badHybridCall() {
    markdownlint.readConfigSync(
      "./test/config/config-badcontent.txt",
      [ JSON.parse, require("toml").parse, require("js-yaml").safeLoad ]);
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad content.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.ok(err.message.match(
      // eslint-disable-next-line max-len
      /^Unable to parse '[^']*'; Unexpected token \S+ in JSON at position \d+; Expected [^;]+ or end of input but "\S+" found.; end of the stream or a document separator is expected at line \d+, column \d+:[^;]*$/
    ), "Error message unexpected.");
    return true;
  }, "Did not get exception for bad content.");
  test.done();
};

module.exports.allBuiltInRulesHaveValidUrl =
  function allBuiltInRulesHaveValidUrl(test) {
    test.expect(129);
    rules.forEach(function forRule(rule) {
      test.ok(rule.information);
      test.ok(Object.getPrototypeOf(rule.information) === URL.prototype);
      const name = rule.names[0].toLowerCase();
      test.equal(
        rule.information.href,
        `${homepage}/blob/v${version}/doc/Rules.md#${name}`
      );
    });
    test.done();
  };

module.exports.someCustomRulesHaveValidUrl =
  function someCustomRulesHaveValidUrl(test) {
    test.expect(7);
    customRules.all.forEach(function forRule(rule) {
      test.ok(!rule.information ||
        (Object.getPrototypeOf(rule.information) === URL.prototype));
      if (rule === customRules.anyBlockquote) {
        test.equal(
          rule.information,
          `${homepage}/blob/master/test/rules/any-blockquote.js`
        );
      } else if (rule === customRules.lettersEX) {
        test.equal(
          rule.information,
          `${homepage}/blob/master/test/rules/letters-E-X.js`
        );
      }
    });
    test.done();
  };

module.exports.customRulesV0 = function customRulesV0(test) {
  test.expect(4);
  const customRulesMd = "./test/custom-rules.md";
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = {
      "any-blockquote": [ 12 ],
      "every-n-lines": [ 2, 4, 6, 10, 12 ],
      "first-line": [ 1 ],
      "letters-E-X": [ 3, 7 ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    let actualMessage = actualResult.toString();
    let expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote" +
      " Rule that reports an error for any blockquote\n" +
      "./test/custom-rules.md: 2: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 4: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 6: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 10: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 12: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 1: first-line" +
      " Rule that reports an error for the first line\n" +
      "./test/custom-rules.md: 3: letters-E-X" +
      " Rule that reports an error for lines with the letters 'EX'\n" +
      "./test/custom-rules.md: 7: letters-E-X" +
      " Rule that reports an error for lines with the letters 'EX'";
    test.equal(actualMessage, expectedMessage, "Incorrect message (name).");
    actualMessage = actualResult.toString(true);
    expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote" +
      " Rule that reports an error for any blockquote\n" +
      "./test/custom-rules.md: 2: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 4: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 6: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 10: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 12: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 1: first-line" +
      " Rule that reports an error for the first line\n" +
      "./test/custom-rules.md: 3: letter-E-letter-X" +
      " Rule that reports an error for lines with the letters 'EX'\n" +
      "./test/custom-rules.md: 7: letter-E-letter-X" +
      " Rule that reports an error for lines with the letters 'EX'";
    test.equal(actualMessage, expectedMessage, "Incorrect message (alias).");
    test.done();
  });
};

module.exports.customRulesV1 = function customRulesV1(test) {
  test.expect(3);
  const customRulesMd = "./test/custom-rules.md";
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 1
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = [
      { "lineNumber": 12,
        "ruleName": "any-blockquote",
        "ruleAlias": "any-blockquote",
        "ruleDescription": "Rule that reports an error for any blockquote",
        "ruleInformation":
          `${homepage}/blob/master/test/rules/any-blockquote.js`,
        "errorDetail": "Blockquote spans 1 line(s).",
        "errorContext": "> Block",
        "errorRange": null },
      { "lineNumber": 2,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 2",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 4,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 4",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 6,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 6",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 10,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 10",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 12,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 12",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 1,
        "ruleName": "first-line",
        "ruleAlias": "first-line",
        "ruleDescription": "Rule that reports an error for the first line",
        "ruleInformation": null,
        "errorDetail": null,
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 3,
        "ruleName": "letters-E-X",
        "ruleAlias": "letter-E-letter-X",
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "ruleInformation": `${homepage}/blob/master/test/rules/letters-E-X.js`,
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null },
      { "lineNumber": 7,
        "ruleName": "letters-E-X",
        "ruleAlias": "letter-E-letter-X",
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "ruleInformation": `${homepage}/blob/master/test/rules/letters-E-X.js`,
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null }
    ];
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote/any-blockquote" +
      " Rule that reports an error for any blockquote" +
      " [Blockquote spans 1 line(s).] [Context: \"> Block\"]\n" +
      "./test/custom-rules.md: 2: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 2]\n" +
      "./test/custom-rules.md: 4: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 4]\n" +
      "./test/custom-rules.md: 6: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 6]\n" +
      "./test/custom-rules.md: 10: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 10]\n" +
      "./test/custom-rules.md: 12: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 12]\n" +
      "./test/custom-rules.md: 1: first-line/first-line" +
      " Rule that reports an error for the first line\n" +
      "./test/custom-rules.md: 3: letters-E-X/letter-E-letter-X" +
      " Rule that reports an error for lines with the letters 'EX'" +
      " [Context: \"text\"]\n" +
      "./test/custom-rules.md: 7: letters-E-X/letter-E-letter-X" +
      " Rule that reports an error for lines with the letters 'EX'" +
      " [Context: \"text\"]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.customRulesV2 = function customRulesV2(test) {
  test.expect(3);
  const customRulesMd = "./test/custom-rules.md";
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 2
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = [
      { "lineNumber": 12,
        "ruleNames": [ "any-blockquote" ],
        "ruleDescription": "Rule that reports an error for any blockquote",
        "ruleInformation":
          `${homepage}/blob/master/test/rules/any-blockquote.js`,
        "errorDetail": "Blockquote spans 1 line(s).",
        "errorContext": "> Block",
        "errorRange": null },
      { "lineNumber": 2,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 2",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 4,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 4",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 6,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 6",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 10,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 10",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 12,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "ruleInformation": null,
        "errorDetail": "Line number 12",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 1,
        "ruleNames": [ "first-line" ],
        "ruleDescription": "Rule that reports an error for the first line",
        "ruleInformation": null,
        "errorDetail": null,
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 3,
        "ruleNames": [ "letters-E-X", "letter-E-letter-X", "contains-ex" ],
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "ruleInformation": `${homepage}/blob/master/test/rules/letters-E-X.js`,
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null },
      { "lineNumber": 7,
        "ruleNames": [ "letters-E-X", "letter-E-letter-X", "contains-ex" ],
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "ruleInformation": `${homepage}/blob/master/test/rules/letters-E-X.js`,
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null }
    ];
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote" +
      " Rule that reports an error for any blockquote" +
      " [Blockquote spans 1 line(s).] [Context: \"> Block\"]\n" +
      "./test/custom-rules.md: 2: every-n-lines" +
      " Rule that reports an error every N lines [Line number 2]\n" +
      "./test/custom-rules.md: 4: every-n-lines" +
      " Rule that reports an error every N lines [Line number 4]\n" +
      "./test/custom-rules.md: 6: every-n-lines" +
      " Rule that reports an error every N lines [Line number 6]\n" +
      "./test/custom-rules.md: 10: every-n-lines" +
      " Rule that reports an error every N lines [Line number 10]\n" +
      "./test/custom-rules.md: 12: every-n-lines" +
      " Rule that reports an error every N lines [Line number 12]\n" +
      "./test/custom-rules.md: 1: first-line" +
      " Rule that reports an error for the first line\n" +
      "./test/custom-rules.md: 3: letters-E-X/letter-E-letter-X/contains-ex" +
      " Rule that reports an error for lines with the letters 'EX'" +
      " [Context: \"text\"]\n" +
      "./test/custom-rules.md: 7: letters-E-X/letter-E-letter-X/contains-ex" +
      " Rule that reports an error for lines with the letters 'EX'" +
      " [Context: \"text\"]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.customRulesConfig = function customRulesConfig(test) {
  test.expect(2);
  const customRulesMd = "./test/custom-rules.md";
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "config": {
      "blockquote": true,
      "every-n-lines": {
        "n": 3
      },
      "letters-e-x": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = {
      "any-blockquote": [ 12 ],
      "every-n-lines": [ 3, 6, 12 ],
      "first-line": [ 1 ],
      "letters-E-X": [ 7 ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.customRulesNpmPackage = function customRulesNpmPackage(test) {
  test.expect(2);
  const options = {
    "customRules": [ require("./rules/npm") ],
    "strings": {
      "string": "# Text\n\n---\n\nText\n"
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {};
    expectedResult.string = {
      "sample-rule": [ 3 ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.customRulesBadProperty = function customRulesBadProperty(test) {
  test.expect(92);
  [
    [ "names", [ null, "string", [], [ null ], [ "" ], [ "string", 10 ] ] ],
    [ "description", [ null, 10, "", [] ] ],
    [ "information", [ 10, [], "string", "https://example.com" ] ],
    [ "tags", [ null, "string", [], [ null ], [ "" ], [ "string", 10 ] ] ],
    [ "function", [ null, "string", [] ] ]
  ].forEach(function forProperty(property) {
    const propertyName = property[0];
    property[1].forEach(function forPropertyValue(propertyValue) {
      const badRule = { ...customRules.anyBlockquote };
      badRule[propertyName] = propertyValue;
      const options = {
        "customRules": [ badRule ]
      };
      test.throws(function badRuleCall() {
        markdownlint.sync(options);
      }, function testError(err) {
        test.ok(err, "Did not get an error for missing property.");
        test.ok(err instanceof Error, "Error not instance of Error.");
        test.equal(err.message,
          "Property '" + propertyName +
            "' of custom rule at index 0 is incorrect.",
          "Incorrect message for missing property.");
        return true;
      }, "Did not get exception for missing property.");
    });
  });
  test.done();
};

module.exports.customRulesUsedNameName =
function customRulesUsedNameName(test) {
  test.expect(4);
  markdownlint({
    "customRules": [
      {
        "names": [ "name", "NO-missing-SPACE-atx" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for duplicate name.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message,
      "Name 'NO-missing-SPACE-atx' of custom rule at index 0 is " +
        "already used as a name or tag.",
      "Incorrect message for duplicate name.");
    test.ok(!result, "Got result for duplicate name.");
    test.done();
  });
};

module.exports.customRulesUsedNameTag =
function customRulesUsedNameTag(test) {
  test.expect(4);
  markdownlint({
    "customRules": [
      {
        "names": [ "name", "HtMl" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for duplicate name.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message,
      "Name 'HtMl' of custom rule at index 0 is already used as a name or tag.",
      "Incorrect message for duplicate name.");
    test.ok(!result, "Got result for duplicate name.");
    test.done();
  });
};

module.exports.customRulesUsedTagName =
function customRulesUsedTagName(test) {
  test.expect(4);
  markdownlint({
    "customRules": [
      {
        "names": [ "filler" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function noop() {}
      },
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag", "NO-missing-SPACE-atx" ],
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for duplicate tag.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message,
      "Tag 'NO-missing-SPACE-atx' of custom rule at index 1 is " +
        "already used as a name.",
      "Incorrect message for duplicate name.");
    test.ok(!result, "Got result for duplicate tag.");
    test.done();
  });
};

module.exports.customRulesThrowForFile =
  function customRulesThrowForFile(test) {
    test.expect(4);
    const exceptionMessage = "Test exception message";
    markdownlint({
      "customRules": [
        {
          "names": [ "name" ],
          "description": "description",
          "tags": [ "tag" ],
          "function": function throws() {
            throw new Error(exceptionMessage);
          }
        }
      ],
      "files": [ "./test/custom-rules.md" ]
    }, function callback(err, result) {
      test.ok(err, "Did not get an error for function thrown.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.equal(err.message, exceptionMessage,
        "Incorrect message for function thrown.");
      test.ok(!result, "Got result for function thrown.");
      test.done();
    });
  };

module.exports.customRulesThrowForFileSync =
  function customRulesThrowForFileSync(test) {
    test.expect(4);
    const exceptionMessage = "Test exception message";
    test.throws(function customRuleThrowsCall() {
      markdownlint.sync({
        "customRules": [
          {
            "names": [ "name" ],
            "description": "description",
            "tags": [ "tag" ],
            "function": function throws() {
              throw new Error(exceptionMessage);
            }
          }
        ],
        "files": [ "./test/custom-rules.md" ]
      });
    }, function testError(err) {
      test.ok(err, "Did not get an error for function thrown.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.equal(err.message, exceptionMessage,
        "Incorrect message for function thrown.");
      return true;
    }, "Did not get exception for function thrown.");
    test.done();
  };

module.exports.customRulesThrowForString =
  function customRulesThrowForString(test) {
    test.expect(4);
    const exceptionMessage = "Test exception message";
    markdownlint({
      "customRules": [
        {
          "names": [ "name" ],
          "description": "description",
          "tags": [ "tag" ],
          "function": function throws() {
            throw new Error(exceptionMessage);
          }
        }
      ],
      "strings": {
        "string": "String"
      }
    }, function callback(err, result) {
      test.ok(err, "Did not get an error for function thrown.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.equal(err.message, exceptionMessage,
        "Incorrect message for function thrown.");
      test.ok(!result, "Got result for function thrown.");
      test.done();
    });
  };

module.exports.customRulesOnErrorNull = function customRulesOnErrorNull(test) {
  test.expect(4);
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function onErrorNull(params, onError) {
          onError(null);
        }
      }
    ],
    "strings": {
      "string": "String"
    }
  };
  test.throws(function nullErrorCall() {
    markdownlint.sync(options);
  }, function testError(err) {
    test.ok(err, "Did not get an error for null object.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message,
      "Property 'lineNumber' of onError parameter is incorrect.",
      "Incorrect message for null object.");
    return true;
  }, "Did not get exception for null object.");
  test.done();
};

module.exports.customRulesOnErrorBad = function customRulesOnErrorBad(test) {
  test.expect(84);
  [
    [ "lineNumber", null, [ null, "string" ] ],
    [ "detail", null, [ 10, [] ] ],
    [ "context", null, [ 10, [] ] ],
    [ "range", null, [ 10, [], [ 10 ], [ 10, null ], [ 10, 11, 12 ] ] ],
    [ "fixInfo", null, [ 10, "string" ] ],
    [ "fixInfo", "lineNumber", [ null, "string" ] ],
    [ "fixInfo", "editColumn", [ null, "string" ] ],
    [ "fixInfo", "deleteCount", [ null, "string" ] ],
    [ "fixInfo", "insertText", [ 10, [] ] ]
  ].forEach(function forProperty(property) {
    const [ propertyName, subPropertyName, propertyValues ] = property;
    propertyValues.forEach(function forPropertyValue(propertyValue) {
      const badObject = {
        "lineNumber": 1
      };
      let propertyNames = null;
      if (subPropertyName) {
        badObject[propertyName] = {};
        badObject[propertyName][subPropertyName] = propertyValue;
        propertyNames = `${propertyName}.${subPropertyName}`;
      } else {
        badObject[propertyName] = propertyValue;
        propertyNames = propertyName;
      }
      const options = {
        "customRules": [
          {
            "names": [ "name" ],
            "description": "description",
            "tags": [ "tag" ],
            "function": function onErrorBad(params, onError) {
              onError(badObject);
            }
          }
        ],
        "strings": {
          "string": "String"
        }
      };
      test.throws(function badErrorCall() {
        markdownlint.sync(options);
      }, function testError(err) {
        test.ok(err, "Did not get an error for bad object.");
        test.ok(err instanceof Error, "Error not instance of Error.");
        test.equal(err.message,
          "Property '" + propertyNames + "' of onError parameter is incorrect.",
          "Incorrect message for bad object.");
        return true;
      }, "Did not get exception for bad object.");
    });
  });
  test.done();
};

module.exports.customRulesOnErrorInvalid =
  function customRulesOnErrorInvalid(test) {
    test.expect(68);
    [
      [ "lineNumber", null, [ -1, 0, 3, 4 ] ],
      [ "range", null, [ [ 0, 1 ], [ 1, 0 ], [ 5, 1 ], [ 1, 5 ], [ 4, 2 ] ] ],
      [ "fixInfo", "lineNumber", [ -1, 0, 3, 4 ] ],
      [ "fixInfo", "editColumn", [ 0, 6 ] ],
      [ "fixInfo", "deleteCount", [ -2, 5 ] ]
    ].forEach(function forProperty(property) {
      const [ propertyName, subPropertyName, propertyValues ] = property;
      propertyValues.forEach(function forPropertyValue(propertyValue) {
        const badObject = {
          "lineNumber": 1
        };
        let propertyNames = null;
        if (subPropertyName) {
          badObject[propertyName] = {};
          badObject[propertyName][subPropertyName] = propertyValue;
          propertyNames = `${propertyName}.${subPropertyName}`;
        } else {
          badObject[propertyName] = propertyValue;
          propertyNames = propertyName;
        }
        const options = {
          "customRules": [
            {
              "names": [ "name" ],
              "description": "description",
              "tags": [ "tag" ],
              "function": function onErrorInvalid(params, onError) {
                onError(badObject);
              }
            }
          ],
          "strings": {
            "string": "Text\ntext"
          }
        };
        test.throws(function invalidErrorCall() {
          markdownlint.sync(options);
        }, function testError(err) {
          test.ok(err, "Did not get an error for invalid object.");
          test.ok(err instanceof Error, "Error not instance of Error.");
          test.equal(err.message,
            `Property '${propertyNames}' of onError parameter is incorrect.`,
            "Incorrect message for invalid object.");
          return true;
        }, "Did not get exception for invalid object.");
      });
    });
    test.done();
  };

module.exports.customRulesOnErrorValid =
  function customRulesOnErrorValid(test) {
    test.expect(24);
    [
      [ "lineNumber", null, [ 1, 2 ] ],
      [ "range", null, [ [ 1, 1 ], [ 1, 4 ], [ 2, 2 ], [ 3, 2 ], [ 4, 1 ] ] ],
      [ "fixInfo", "lineNumber", [ 1, 2 ] ],
      [ "fixInfo", "editColumn", [ 1, 2, 4, 5 ] ],
      [ "fixInfo", "deleteCount", [ -1, 0, 1, 4 ] ],
      [
        "fixInfo",
        "insertText",
        [ "", "1", "123456", "\n", "\nText", "Text\n", "\nText\n" ]
      ]
    ].forEach(function forProperty(property) {
      const [ propertyName, subPropertyName, propertyValues ] = property;
      propertyValues.forEach(function forPropertyValue(propertyValue) {
        const goodObject = {
          "lineNumber": 1
        };
        if (subPropertyName) {
          goodObject[propertyName] = {};
          goodObject[propertyName][subPropertyName] = propertyValue;
        } else {
          goodObject[propertyName] = propertyValue;
        }
        const options = {
          "customRules": [
            {
              "names": [ "name" ],
              "description": "description",
              "tags": [ "tag" ],
              "function": function onErrorValid(params, onError) {
                onError(goodObject);
              }
            }
          ],
          "strings": {
            "string": "Text\ntext"
          }
        };
        markdownlint.sync(options);
        test.ok(true);
      });
    });
    test.done();
  };

module.exports.customRulesOnErrorLazy = function customRulesOnErrorLazy(test) {
  test.expect(2);
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function onErrorNull(params, onError) {
          onError({
            "lineNumber": 1,
            "detail": "",
            "context": "",
            "range": [ 1, 1 ]
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "string": [
        {
          "lineNumber": 1,
          "ruleNames": [ "name" ],
          "ruleDescription": "description",
          "ruleInformation": null,
          "errorDetail": null,
          "errorContext": null,
          "errorRange": [ 1, 1 ]
        }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.customRulesThrowForFileHandled =
  function customRulesThrowForFileHandled(test) {
    test.expect(2);
    const exceptionMessage = "Test exception message";
    markdownlint({
      "customRules": [
        {
          "names": [ "name" ],
          "description": "description",
          "tags": [ "tag" ],
          "function": function throws() {
            throw new Error(exceptionMessage);
          }
        }
      ],
      "files": [ "./test/custom-rules.md" ],
      "handleRuleFailures": true
    }, function callback(err, actualResult) {
      test.ifError(err);
      const expectedResult = {
        "./test/custom-rules.md": [
          {
            "lineNumber": 1,
            "ruleNames": [ "name" ],
            "ruleDescription": "description",
            "ruleInformation": null,
            "errorDetail":
              `This rule threw an exception: ${exceptionMessage}`,
            "errorContext": null,
            "errorRange": null
          }
        ]
      };
      test.deepEqual(actualResult, expectedResult, "Undetected issues.");
      test.done();
    });
  };

module.exports.customRulesThrowForStringHandled =
  function customRulesThrowForStringHandled(test) {
    test.expect(2);
    const exceptionMessage = "Test exception message";
    const informationUrl = "https://example.com/rule";
    markdownlint({
      "customRules": [
        {
          "names": [ "name" ],
          "description": "description",
          "information": new URL(informationUrl),
          "tags": [ "tag" ],
          "function": function throws() {
            throw new Error(exceptionMessage);
          }
        }
      ],
      "strings": {
        "string": "String\n"
      },
      "handleRuleFailures": true
    }, function callback(err, actualResult) {
      test.ifError(err);
      const expectedResult = {
        "string": [
          {
            "lineNumber": 1,
            "ruleNames": [ "MD041", "first-line-heading", "first-line-h1" ],
            "ruleDescription":
              "First line in file should be a top level heading",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/Rules.md#md041`,
            "errorDetail": null,
            "errorContext": "String",
            "errorRange": null
          },
          {
            "lineNumber": 1,
            "ruleNames": [ "name" ],
            "ruleDescription": "description",
            "ruleInformation": informationUrl,
            "errorDetail":
              `This rule threw an exception: ${exceptionMessage}`,
            "errorContext": null,
            "errorRange": null
          }
        ]
      };
      test.deepEqual(actualResult, expectedResult, "Undetected issues.");
      test.done();
    });
  };

module.exports.customRulesOnErrorInvalidHandled =
  function customRulesOnErrorInvalidHandled(test) {
    test.expect(2);
    markdownlint({
      "customRules": [
        {
          "names": [ "name" ],
          "description": "description",
          "tags": [ "tag" ],
          "function": function onErrorInvalid(params, onError) {
            onError({
              "lineNumber": 13,
              "detail": "N/A"
            });
          }
        }
      ],
      "strings": {
        "string": "# Heading\n"
      },
      "handleRuleFailures": true
    }, function callback(err, actualResult) {
      test.ifError(err);
      const expectedResult = {
        "string": [
          {
            "lineNumber": 1,
            "ruleNames": [ "name" ],
            "ruleDescription": "description",
            "ruleInformation": null,
            "errorDetail": "This rule threw an exception: " +
              "Property 'lineNumber' of onError parameter is incorrect.",
            "errorContext": null,
            "errorRange": null
          }
        ]
      };
      test.deepEqual(actualResult, expectedResult, "Undetected issues.");
      test.done();
    });
  };

module.exports.customRulesFileName = function customRulesFileName(test) {
  test.expect(2);
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function stringName(params) {
          test.equal(params.name, "doc/CustomRules.md", "Incorrect file name");
        }
      }
    ],
    "files": "doc/CustomRules.md"
  };
  markdownlint(options, function callback(err) {
    test.ifError(err);
    test.done();
  });
};

module.exports.customRulesStringName = function customRulesStringName(test) {
  test.expect(2);
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function stringName(params) {
          test.equal(params.name, "string", "Incorrect string name");
        }
      }
    ],
    "strings": {
      "string": "# Heading"
    }
  };
  markdownlint(options, function callback(err) {
    test.ifError(err);
    test.done();
  });
};

module.exports.customRulesDoc = function customRulesDoc(test) {
  test.expect(2);
  markdownlint({
    "files": "doc/CustomRules.md",
    "config": {
      "MD013": { "line_length": 200 }
    }
  }, function callback(err, actual) {
    test.ifError(err);
    const expected = { "doc/CustomRules.md": [] };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.done();
  });
};

module.exports.customRulesLintJavaScript =
  function customRulesLintJavaScript(test) {
    test.expect(2);
    const options = {
      "customRules": customRules.lintJavaScript,
      "files": "test/lint-javascript.md"
    };
    markdownlint(options, (err, actual) => {
      test.ifError(err);
      const expected = {
        "test/lint-javascript.md": [
          {
            "lineNumber": 10,
            "ruleNames": [ "lint-javascript" ],
            "ruleDescription": "Rule that lints JavaScript code",
            "ruleInformation": null,
            "errorDetail": "Unexpected var, use let or const instead.",
            "errorContext": "var x = 0;",
            "errorRange": null
          },
          {
            "lineNumber": 12,
            "ruleNames": [ "lint-javascript" ],
            "ruleDescription": "Rule that lints JavaScript code",
            "ruleInformation": null,
            "errorDetail": "Unexpected console statement.",
            "errorContext": "console.log(x);",
            "errorRange": null
          }
        ]
      };
      test.deepEqual(actual, expected, "Unexpected issues.");
      test.done();
    });
  };

module.exports.markdownItPluginsSingle =
  function markdownItPluginsSingle(test) {
    test.expect(2);
    markdownlint({
      "strings": {
        "string": "# Heading\n\nText [ link ](https://example.com)\n"
      },
      "markdownItPlugins": [
        [
          pluginInline,
          "trim_text_plugin",
          "text",
          function iterator(tokens, index) {
            tokens[index].content = tokens[index].content.trim();
          }
        ]
      ]
    }, function callback(err, actual) {
      test.ifError(err);
      const expected = { "string": [] };
      test.deepEqual(actual, expected, "Unexpected issues.");
      test.done();
    });
  };

module.exports.markdownItPluginsMultiple =
  function markdownItPluginsMultiple(test) {
    test.expect(4);
    markdownlint({
      "strings": {
        "string": "# Heading\n\nText H~2~0 text 29^th^ text\n"
      },
      "markdownItPlugins": [
        [ pluginSub ],
        [ pluginSup ],
        [ pluginInline, "check_sub_plugin", "sub_open", test.ok ],
        [ pluginInline, "check_sup_plugin", "sup_open", test.ok ]
      ]
    }, function callback(err, actual) {
      test.ifError(err);
      const expected = { "string": [] };
      test.deepEqual(actual, expected, "Unexpected issues.");
      test.done();
    });
  };

module.exports.markdownItPluginsMathjax =
  function markdownItPluginsMathjax(test) {
    test.expect(2);
    markdownlint({
      "strings": {
        "string":
          "# Heading\n" +
          "\n" +
          "$1 *2* 3$\n" +
          "\n" +
          "$$1 *2* 3$$\n" +
          "\n" +
          "$$1\n" +
          "+ 2\n" +
          "+ 3$$\n"
      },
      "markdownItPlugins": [ [ pluginKatex ] ]
    }, function callback(err, actual) {
      test.ifError(err);
      const expected = { "string": [] };
      test.deepEqual(actual, expected, "Unexpected issues.");
      test.done();
    });
  };

module.exports.markdownItPluginsMathjaxIssue166 =
  function markdownItPluginsMathjaxIssue166(test) {
    test.expect(2);
    markdownlint({
      "strings": {
        "string":
`## Heading

$$
1
$$$$
2
$$\n`
      },
      "markdownItPlugins": [ [ pluginKatex ] ],
      "resultVersion": 0
    }, function callback(err, actual) {
      test.ifError(err);
      const expected = {
        "string": {
          "MD041": [ 1 ]
        }
      };
      test.deepEqual(actual, expected, "Unexpected issues.");
      test.done();
    });
  };

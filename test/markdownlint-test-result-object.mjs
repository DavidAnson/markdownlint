// @ts-check

import test from "node:test";
import { lint as lintAsync } from "markdownlint/async";
import { lint as lintPromise } from "markdownlint/promise";
import { convertToResultVersion0, convertToResultVersion1, convertToResultVersion2 } from "markdownlint/helpers";
import firstLine from "./rules/first-line.cjs";
// eslint-disable-next-line @stylistic/quote-props
import packageJson from "../package.json" with { type: "json" };
const { homepage, version } = packageJson;

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  test("resultFormatting", (t) => new Promise((resolve) => {
    t.plan(2);
    const options = {
      "strings": {
        "input":
          "# Heading   \n" +
          "\n" +
          "Text\ttext\t\ttext\n" +
          "Text * emphasis * text"
      }
    };
    lintAsync(options, function callback(err, actualResult) {
      t.assert.equal(err, null);
      const expectedResult = {
        "input": [
          {
            "lineNumber": 1,
            "ruleNames": [ "MD009", "no-trailing-spaces" ],
            "ruleDescription": "Trailing spaces",
            "ruleInformation": `${homepage}/blob/v${version}/doc/md009.md`,
            "errorDetail": "Expected: 0 or 2; Actual: 3",
            "errorContext": null,
            "errorRange": [ 10, 3 ],
            "fixInfo": {
              "editColumn": 10,
              "deleteCount": 3
            },
            "severity": "error"
          },
          {
            "lineNumber": 3,
            "ruleNames": [ "MD010", "no-hard-tabs" ],
            "ruleDescription": "Hard tabs",
            "ruleInformation": `${homepage}/blob/v${version}/doc/md010.md`,
            "errorDetail": "Column: 5",
            "errorContext": null,
            "errorRange": [ 5, 1 ],
            "fixInfo": {
              "editColumn": 5,
              "deleteCount": 1,
              "insertText": " "
            },
            "severity": "error"
          },
          {
            "lineNumber": 3,
            "ruleNames": [ "MD010", "no-hard-tabs" ],
            "ruleDescription": "Hard tabs",
            "ruleInformation": `${homepage}/blob/v${version}/doc/md010.md`,
            "errorDetail": "Column: 10",
            "errorContext": null,
            "errorRange": [ 10, 2 ],
            "fixInfo": {
              "editColumn": 10,
              "deleteCount": 2,
              "insertText": "  "
            },
            "severity": "error"
          },
          {
            "lineNumber": 4,
            "ruleNames": [ "MD037", "no-space-in-emphasis" ],
            "ruleDescription": "Spaces inside emphasis markers",
            "ruleInformation": `${homepage}/blob/v${version}/doc/md037.md`,
            "errorDetail": null,
            "errorContext": "* e",
            "errorRange": [ 7, 1 ],
            "fixInfo": {
              "editColumn": 7,
              "deleteCount": 1
            },
            "severity": "error"
          },
          {
            "lineNumber": 4,
            "ruleNames": [ "MD037", "no-space-in-emphasis" ],
            "ruleDescription": "Spaces inside emphasis markers",
            "ruleInformation": `${homepage}/blob/v${version}/doc/md037.md`,
            "errorDetail": null,
            "errorContext": "s *",
            "errorRange": [ 16, 1 ],
            "fixInfo": {
              "editColumn": 16,
              "deleteCount": 1
            },
            "severity": "error"
          },
          {
            "lineNumber": 4,
            "ruleNames": [ "MD047", "single-trailing-newline" ],
            "ruleDescription": "Files should end with a single newline character",
            "ruleInformation": `${homepage}/blob/v${version}/doc/md047.md`,
            "errorDetail": null,
            "errorContext": null,
            "errorRange": [ 22, 1 ],
            "fixInfo": {
              "insertText": "\n",
              "editColumn": 23
            },
            "severity": "error"
          }
        ]
      };
      t.assert.deepEqual(actualResult, expectedResult);
      resolve();
    });
  }));

  test("correctPerLineResult", (t) => new Promise((resolve) => {
    t.plan(5);
    const options = {
      "strings": {
        "input": "# Heading\theading\t\theading\n"
      }
    };
    lintAsync(options, function callback(err, actualResult) {
      t.assert.equal(err, null);
      const expectedResultV0 = {
        "input": {
          "MD010": [ 1 ]
        }
      };
      t.assert.deepEqual(convertToResultVersion0(actualResult || {}), expectedResultV0);
      const expectedResultV1 = {
        "input": [
          {
            "lineNumber": 1,
            "ruleName": "MD010",
            "ruleAlias": "no-hard-tabs",
            "ruleDescription": "Hard tabs",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/md010.md`,
            "errorDetail": "Column: 10",
            "errorContext": null,
            "errorRange": [ 10, 1 ]
          }
        ]
      };
      t.assert.deepEqual(convertToResultVersion1(actualResult || {}), expectedResultV1);
      const expectedResultV2 = {
        "input": [
          {
            "lineNumber": 1,
            "ruleNames": [ "MD010", "no-hard-tabs" ],
            "ruleDescription": "Hard tabs",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/md010.md`,
            "errorDetail": "Column: 10",
            "errorContext": null,
            "errorRange": [ 10, 1 ]
          }
        ]
      };
      t.assert.deepEqual(convertToResultVersion2(actualResult || {}), expectedResultV2);
      const expectedResult = {
        "input": [
          {
            "lineNumber": 1,
            "ruleNames": [ "MD010", "no-hard-tabs" ],
            "ruleDescription": "Hard tabs",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/md010.md`,
            "errorDetail": "Column: 10",
            "errorContext": null,
            "errorRange": [ 10, 1 ],
            "fixInfo": {
              "editColumn": 10,
              "deleteCount": 1,
              "insertText": " "
            },
            "severity": "error"
          },
          {
            "lineNumber": 1,
            "ruleNames": [ "MD010", "no-hard-tabs" ],
            "ruleDescription": "Hard tabs",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/md010.md`,
            "errorDetail": "Column: 18",
            "errorContext": null,
            "errorRange": [ 18, 2 ],
            "fixInfo": {
              "editColumn": 18,
              "deleteCount": 2,
              "insertText": "  "
            },
            "severity": "error"
          }
        ]
      };
      t.assert.deepEqual(actualResult, expectedResult);
      resolve();
    });
  }));

  test("frontMatterResult", (t) => new Promise((resolve) => {
    t.plan(2);
    const options = {
      "strings": {
        "input": "---\n---\n# Heading\nText\n"
      }
    };
    lintAsync(options, function callback(err, actualResult) {
      t.assert.equal(err, null);
      const expectedResult = {
        "input": [
          {
            "lineNumber": 3,
            "ruleNames":
              [ "MD022", "blanks-around-headings" ],
            "ruleDescription": "Headings should be surrounded by blank lines",
            "ruleInformation":
              `${homepage}/blob/v${version}/doc/md022.md`,
            "errorDetail": "Expected: 1; Actual: 0; Below",
            "errorContext": "# Heading",
            "errorRange": null,
            "fixInfo": {
              "lineNumber": 4,
              "insertText": "\n"
            },
            "severity": "error"
          }
        ]
      };
      t.assert.deepEqual(actualResult, expectedResult);
      resolve();
    });
  }));

  test("lintResultObjectKeysAreSorted", async(t) => {
    t.plan(1);
    const options = {
      "files": [
        "./test/break-all-the-rules.md",
        "./test/inline-disable-enable.md",
        "./test/atx_heading_spacing.md",
        "./test/first_heading_bad_atx.md"
      ],
      "strings": {
        "first": "#  Heading",
        "second": "## Heading",
        "third": "#  Heading",
        "fourth": "## Heading"
      }
    };
    const actual = Object.keys(await lintPromise(options));
    const expected = [
      "./test/atx_heading_spacing.md",
      "./test/break-all-the-rules.md",
      "./test/first_heading_bad_atx.md",
      "./test/inline-disable-enable.md",
      "first",
      "fourth",
      "second",
      "third"
    ];
    t.assert.deepEqual(actual, expected);
  });

  test("convertToResultVersionN", async(t) => {
    t.plan(1);
    const options = {
      "customRules": [ firstLine ],
      "files": [
        "./test/break-all-the-rules.md",
        "./test/inline-disable-enable.md"
      ],
      "strings": {
        "first": "#  Heading",
        "second": "## Heading"
      }
    };
    const results = await lintPromise(options);
    const version0 = convertToResultVersion0(results);
    const version1 = convertToResultVersion1(results);
    const version2 = convertToResultVersion2(results);
    t.assert.snapshot({
      results,
      version0,
      version1,
      version2
    });
  });

});

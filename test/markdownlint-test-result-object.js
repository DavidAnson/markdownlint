// @ts-check

"use strict";

const test = require("ava").default;
const packageJson = require("../package.json");
const markdownlint = require("../lib/markdownlint");
const homepage = packageJson.homepage;
const version = packageJson.version;

test.cb("resultObjectToStringNotEnumerable", (t) => {
  t.plan(2);
  const options = {
    "strings": {
      "string": "# Heading"
    }
  };
  markdownlint(options, function callback(err, result) {
    t.falsy(err);
    // eslint-disable-next-line guard-for-in
    for (const property in result) {
      t.not(property, "toString", "Function should not enumerate.");
    }
    t.end();
  });
});

test.cb("resultFormattingV0", (t) => {
  t.plan(4);
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
    t.falsy(err);
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
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    let actualMessage = actualResult.toString();
    let expectedMessage =
      "./test/atx_heading_spacing.md: 3: MD002" +
      " First heading should be a top-level heading\n" +
      "./test/atx_heading_spacing.md: 1: MD018" +
      " No space after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 3: MD019" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 5: MD019" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/first_heading_bad_atx.md: 1: MD002" +
      " First heading should be a top-level heading";
    t.is(actualMessage, expectedMessage, "Incorrect message (name).");
    // @ts-ignore
    actualMessage = actualResult.toString(true);
    expectedMessage =
      "./test/atx_heading_spacing.md: 3: first-heading-h1" +
      " First heading should be a top-level heading\n" +
      "./test/atx_heading_spacing.md: 1: no-missing-space-atx" +
      " No space after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 3: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 5: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/first_heading_bad_atx.md: 1: first-heading-h1" +
      " First heading should be a top-level heading";
    t.is(actualMessage, expectedMessage, "Incorrect message (alias).");
    t.end();
  });
});

test("resultFormattingSyncV0", (t) => {
  t.plan(3);
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
  // @ts-ignore
  t.deepEqual(actualResult, expectedResult, "Undetected issues.");
  let actualMessage = actualResult.toString();
  let expectedMessage =
    "./test/atx_heading_spacing.md: 3: MD002" +
    " First heading should be a top-level heading\n" +
    "./test/atx_heading_spacing.md: 1: MD018" +
    " No space after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 3: MD019" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 5: MD019" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/first_heading_bad_atx.md: 1: MD002" +
    " First heading should be a top-level heading";
  t.is(actualMessage, expectedMessage, "Incorrect message (name).");
  // @ts-ignore
  actualMessage = actualResult.toString(true);
  expectedMessage =
    "./test/atx_heading_spacing.md: 3: first-heading-h1" +
    " First heading should be a top-level heading\n" +
    "./test/atx_heading_spacing.md: 1: no-missing-space-atx" +
    " No space after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 3: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 5: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/first_heading_bad_atx.md: 1: first-heading-h1" +
    " First heading should be a top-level heading";
  t.is(actualMessage, expectedMessage, "Incorrect message (alias).");
});

test.cb("resultFormattingV1", (t) => {
  t.plan(3);
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
    t.falsy(err);
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
          "ruleDescription": "First heading should be a top-level heading",
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
          "ruleDescription": "First heading should be a top-level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md002`,
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null }
      ]
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "./test/atx_heading_spacing.md: 3: MD002/first-heading-h1" +
      " First heading should be a top-level heading" +
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
      " First heading should be a top-level heading" +
      " [Expected: h1; Actual: h2]\n" +
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style heading" +
      " [Context: \"#  Multiple spa...tyle heading  #\"]";
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    t.end();
  });
});

test.cb("resultFormattingV2", (t) => {
  t.plan(3);
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
    t.falsy(err);
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
          "ruleDescription": "First heading should be a top-level heading",
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
          "ruleDescription": "First heading should be a top-level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md002`,
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "./test/atx_heading_spacing.md: 3:" +
      " MD002/first-heading-h1/first-header-h1" +
      " First heading should be a top-level heading" +
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
      " First heading should be a top-level heading" +
      " [Expected: h1; Actual: h2]\n" +
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style heading" +
      " [Context: \"#  Multiple spa...tyle heading  #\"]";
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    t.end();
  });
});

test.cb("resultFormattingV3", (t) => {
  t.plan(3);
  const options = {
    "strings": {
      "input":
        "# Heading   \n" +
        "\n" +
        "Text\ttext\t\ttext\n" +
        "Text * emphasis * text"
    },
    "resultVersion": 3
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
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
          "lineNumber": 4,
          "ruleNames": [ "MD037", "no-space-in-emphasis" ],
          "ruleDescription": "Spaces inside emphasis markers",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md037`,
          "errorDetail": null,
          "errorContext": "* emphasis *",
          "errorRange": [ 6, 12 ],
          "fixInfo": {
            "editColumn": 6,
            "deleteCount": 12,
            "insertText": "*emphasis*"
          }
        },
        {
          "lineNumber": 4,
          "ruleNames": [ "MD047", "single-trailing-newline" ],
          "ruleDescription": "Files should end with a single newline character",
          "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md047`,
          "errorDetail": null,
          "errorContext": null,
          "errorRange": [ 22, 1 ],
          "fixInfo": {
            "insertText": "\n",
            "editColumn": 23
          }
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "input: 1: MD009/no-trailing-spaces" +
      " Trailing spaces [Expected: 0 or 2; Actual: 3]\n" +
      "input: 3: MD010/no-hard-tabs" +
      " Hard tabs [Column: 5]\n" +
      "input: 3: MD010/no-hard-tabs" +
      " Hard tabs [Column: 10]\n" +
      "input: 4: MD037/no-space-in-emphasis" +
      " Spaces inside emphasis markers [Context: \"* emphasis *\"]\n" +
      "input: 4: MD047/single-trailing-newline" +
      " Files should end with a single newline character";
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    t.end();
  });
});

test.cb("onePerLineResultVersion0", (t) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "# Heading\theading\t\theading\n"
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "input": {
        "MD010": [ 1 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("onePerLineResultVersion1", (t) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "# Heading\theading\t\theading\n"
    },
    "resultVersion": 1
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
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
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("onePerLineResultVersion2", (t) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "# Heading\theading\t\theading\n"
    },
    "resultVersion": 2
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
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
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("manyPerLineResultVersion3", (t) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "# Heading\theading\t\theading\n"
    },
    "resultVersion": 3
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
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
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("frontMatterResultVersion3", (t) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "---\n---\n# Heading\nText\n"
    },
    "resultVersion": 3
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "input": [
        {
          "lineNumber": 3,
          "ruleNames":
            [ "MD022", "blanks-around-headings", "blanks-around-headers" ],
          "ruleDescription": "Headings should be surrounded by blank lines",
          "ruleInformation":
            `${homepage}/blob/v${version}/doc/Rules.md#md022`,
          "errorDetail": "Expected: 1; Actual: 0; Below",
          "errorContext": "# Heading",
          "errorRange": null,
          "fixInfo": {
            "lineNumber": 4,
            "insertText": "\n"
          }
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

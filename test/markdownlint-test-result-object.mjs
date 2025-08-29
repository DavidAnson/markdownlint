// @ts-check

import test from "ava";
import { lint as lintAsync } from "markdownlint/async";
import { lint as lintPromise } from "markdownlint/promise";
import { lint as lintSync } from "markdownlint/sync";
import { convertToResultVersion0, convertToResultVersion1, convertToResultVersion2 } from "markdownlint/helpers";
import { importWithTypeJson } from "./esm-helpers.mjs";
const packageJson = await importWithTypeJson(import.meta, "../package.json");
const { homepage, version } = packageJson;

test("resultObjectToStringNotEnumerable", (t) => new Promise((resolve) => {
  t.plan(2);
  const options = {
    "strings": {
      "string": "# Heading"
    }
  };
  lintAsync(options, function callback(err, result) {
    t.falsy(err);
    // eslint-disable-next-line guard-for-in
    for (const property in result) {
      t.not(property, "toString", "Function should not enumerate.");
    }
    resolve();
  });
}));

test("resultFormattingV0", (t) => new Promise((resolve) => {
  t.plan(4);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD041": true
    },
    "noInlineConfig": true,
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
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
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    // @ts-ignore
    let actualMessage = actualResult.toString();
    let expectedMessage =
      "./test/atx_heading_spacing.md: 1: MD018" +
      " No space after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 3: MD019" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 5: MD019" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 1: MD041" +
      " First line in a file should be a top-level heading\n" +
      "./test/first_heading_bad_atx.md: 1: MD041" +
      " First line in a file should be a top-level heading";
    t.is(actualMessage, expectedMessage, "Incorrect message (name).");
    // @ts-ignore
    actualMessage = actualResult.toString(true);
    expectedMessage =
      "./test/atx_heading_spacing.md: 1: no-missing-space-atx" +
      " No space after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 3: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 5: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 1: first-line-heading" +
      " First line in a file should be a top-level heading\n" +
      "./test/first_heading_bad_atx.md: 1: first-line-heading" +
      " First line in a file should be a top-level heading";
    t.is(actualMessage, expectedMessage, "Incorrect message (alias).");
    resolve();
  });
}));

test("resultFormattingSyncV0", (t) => {
  t.plan(3);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD041": true
    },
    "noInlineConfig": true,
    "resultVersion": 0
  };
  const actualResult = lintSync(options);
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
  // @ts-ignore
  t.deepEqual(actualResult, expectedResult, "Undetected issues.");
  let actualMessage = actualResult.toString();
  let expectedMessage =
    "./test/atx_heading_spacing.md: 1: MD018" +
    " No space after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 3: MD019" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 5: MD019" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 1: MD041" +
    " First line in a file should be a top-level heading\n" +
    "./test/first_heading_bad_atx.md: 1: MD041" +
    " First line in a file should be a top-level heading";
  t.is(actualMessage, expectedMessage, "Incorrect message (name).");
  // @ts-ignore
  actualMessage = actualResult.toString(true);
  expectedMessage =
    "./test/atx_heading_spacing.md: 1: no-missing-space-atx" +
    " No space after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 3: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 5: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 1: first-line-heading" +
    " First line in a file should be a top-level heading\n" +
    "./test/first_heading_bad_atx.md: 1: first-line-heading" +
    " First line in a file should be a top-level heading";
  t.is(actualMessage, expectedMessage, "Incorrect message (alias).");
});

test("resultFormattingV1", (t) => new Promise((resolve) => {
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
      "MD041": true
    },
    "noInlineConfig": true,
    "resultVersion": 1
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "truncate": [
        { "lineNumber": 1,
          "ruleName": "MD021",
          "ruleAlias": "no-multiple-space-closed-atx",
          "ruleDescription":
            "Multiple spaces inside hashes on closed atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md021.md`,
          "errorDetail": null,
          "errorContext": "#  Multiple spaces inside hash...",
          "errorRange": [ 3, 1 ] }
      ],
      "./test/atx_heading_spacing.md": [
        { "lineNumber": 1,
          "ruleName": "MD018",
          "ruleAlias": "no-missing-space-atx",
          "ruleDescription": "No space after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md018.md`,
          "errorDetail": null,
          "errorContext": "#Heading 1 {MD018}",
          "errorRange": [ 1, 2 ] },
        { "lineNumber": 3,
          "ruleName": "MD019",
          "ruleAlias": "no-multiple-space-atx",
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md019.md`,
          "errorDetail": null,
          "errorContext": "##  Heading 2 {MD019}",
          "errorRange": [ 4, 1 ] },
        { "lineNumber": 5,
          "ruleName": "MD019",
          "ruleAlias": "no-multiple-space-atx",
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md019.md`,
          "errorDetail": null,
          "errorContext": "##   Heading 3 {MD019}",
          "errorRange": [ 4, 2 ] },
        { "lineNumber": 1,
          "ruleName": "MD041",
          "ruleAlias": "first-line-heading",
          "ruleDescription": "First line in a file should be a top-level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md041.md`,
          "errorDetail": null,
          "errorContext": "#Heading 1 {MD018}",
          "errorRange": null }
      ],
      "./test/first_heading_bad_atx.md": [
        { "lineNumber": 1,
          "ruleName": "MD041",
          "ruleAlias": "first-line-heading",
          "ruleDescription": "First line in a file should be a top-level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md041.md`,
          "errorDetail": null,
          "errorContext": "## Heading",
          "errorRange": null }
      ]
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    // @ts-ignore
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "./test/atx_heading_spacing.md: 1: MD018/no-missing-space-atx" +
      " No space after hash on atx style heading" +
      " [Context: \"#Heading 1 {MD018}\"]\n" +
      "./test/atx_heading_spacing.md: 3: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##  Heading 2 {MD019}\"]\n" +
      "./test/atx_heading_spacing.md: 5: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##   Heading 3 {MD019}\"]\n" +
      "./test/atx_heading_spacing.md: 1: MD041/first-line-heading" +
      " First line in a file should be a top-level heading" +
      " [Context: \"#Heading 1 {MD018}\"]\n" +
      "./test/first_heading_bad_atx.md: 1: MD041/first-line-heading" +
      " First line in a file should be a top-level heading" +
      " [Context: \"## Heading\"]\n" +
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style heading" +
      " [Context: \"#  Multiple spaces inside hash...\"]";
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    resolve();
  });
}));

test("resultFormattingV2", (t) => new Promise((resolve) => {
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
      "MD041": true
    },
    "noInlineConfig": true,
    "resultVersion": 2
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "truncate": [
        { "lineNumber": 1,
          "ruleNames": [ "MD021", "no-multiple-space-closed-atx" ],
          "ruleDescription":
            "Multiple spaces inside hashes on closed atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md021.md`,
          "errorDetail": null,
          "errorContext": "#  Multiple spaces inside hash...",
          "errorRange": [ 3, 1 ] }
      ],
      "./test/atx_heading_spacing.md": [
        { "lineNumber": 1,
          "ruleNames": [ "MD018", "no-missing-space-atx" ],
          "ruleDescription": "No space after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md018.md`,
          "errorDetail": null,
          "errorContext": "#Heading 1 {MD018}",
          "errorRange": [ 1, 2 ] },
        { "lineNumber": 3,
          "ruleNames": [ "MD019", "no-multiple-space-atx" ],
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md019.md`,
          "errorDetail": null,
          "errorContext": "##  Heading 2 {MD019}",
          "errorRange": [ 4, 1 ] },
        { "lineNumber": 5,
          "ruleNames": [ "MD019", "no-multiple-space-atx" ],
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md019.md`,
          "errorDetail": null,
          "errorContext": "##   Heading 3 {MD019}",
          "errorRange": [ 4, 2 ] },
        { "lineNumber": 1,
          "ruleNames": [ "MD041", "first-line-heading", "first-line-h1" ],
          "ruleDescription": "First line in a file should be a top-level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md041.md`,
          "errorDetail": null,
          "errorContext": "#Heading 1 {MD018}",
          "errorRange": null }
      ],
      "./test/first_heading_bad_atx.md": [
        { "lineNumber": 1,
          "ruleNames": [ "MD041", "first-line-heading", "first-line-h1" ],
          "ruleDescription": "First line in a file should be a top-level heading",
          "ruleInformation": `${homepage}/blob/v${version}/doc/md041.md`,
          "errorDetail": null,
          "errorContext": "## Heading",
          "errorRange": null }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    // @ts-ignore
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "./test/atx_heading_spacing.md: 1: MD018/no-missing-space-atx" +
      " No space after hash on atx style heading" +
      " [Context: \"#Heading 1 {MD018}\"]\n" +
      "./test/atx_heading_spacing.md: 3: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##  Heading 2 {MD019}\"]\n" +
      "./test/atx_heading_spacing.md: 5: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##   Heading 3 {MD019}\"]\n" +
      "./test/atx_heading_spacing.md: 1:" +
      " MD041/first-line-heading/first-line-h1" +
      " First line in a file should be a top-level heading" +
      " [Context: \"#Heading 1 {MD018}\"]\n" +
      "./test/first_heading_bad_atx.md: 1:" +
      " MD041/first-line-heading/first-line-h1" +
      " First line in a file should be a top-level heading" +
      " [Context: \"## Heading\"]\n" +
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style heading" +
      " [Context: \"#  Multiple spaces inside hash...\"]";
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    resolve();
  });
}));

test("resultFormattingV3", (t) => new Promise((resolve) => {
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
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    // @ts-ignore
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "input: 1: MD009/no-trailing-spaces" +
      " Trailing spaces [Expected: 0 or 2; Actual: 3]\n" +
      "input: 3: MD010/no-hard-tabs" +
      " Hard tabs [Column: 5]\n" +
      "input: 3: MD010/no-hard-tabs" +
      " Hard tabs [Column: 10]\n" +
      "input: 4: MD037/no-space-in-emphasis" +
      " Spaces inside emphasis markers [Context: \"* e\"]\n" +
      "input: 4: MD037/no-space-in-emphasis" +
      " Spaces inside emphasis markers [Context: \"s *\"]\n" +
      "input: 4: MD047/single-trailing-newline" +
      " Files should end with a single newline character";
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    resolve();
  });
}));

test("onePerLineResultVersion0", (t) => new Promise((resolve) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "# Heading\theading\t\theading\n"
    },
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "input": {
        "MD010": [ 1 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("onePerLineResultVersion1", (t) => new Promise((resolve) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "# Heading\theading\t\theading\n"
    },
    "resultVersion": 1
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
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
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("onePerLineResultVersion2", (t) => new Promise((resolve) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "# Heading\theading\t\theading\n"
    },
    "resultVersion": 2
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
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
          "errorRange": [ 10, 1 ]
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("manyPerLineResultVersion3", (t) => new Promise((resolve) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "# Heading\theading\t\theading\n"
    },
    "resultVersion": 3
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
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
          }
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
          }
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("frontMatterResultVersion3", (t) => new Promise((resolve) => {
  t.plan(2);
  const options = {
    "strings": {
      "input": "---\n---\n# Heading\nText\n"
    },
    "resultVersion": 3
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
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
          }
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("convertToResultVersionN", async(t) => {
  t.plan(8);
  const options = {
    "files": [
      "./test/break-all-the-rules.md",
      "./test/inline-disable-enable.md"
    ],
    "strings": {
      "first": "#  Heading",
      "second": "## Heading"
    }
  };
  const [ base, version3, version2, version1, version0 ] = await Promise.all([
    lintPromise(options),
    // @ts-ignore
    lintPromise({ ...options, "resultVersion": 3 }),
    // @ts-ignore
    lintPromise({ ...options, "resultVersion": 2 }),
    // @ts-ignore
    lintPromise({ ...options, "resultVersion": 1 }),
    // @ts-ignore
    lintPromise({ ...options, "resultVersion": 0 })
  ]);
  const v3 = version3;
  t.deepEqual(v3, base);
  t.is(v3.toString(), base.toString());
  const v2 = convertToResultVersion2(base);
  t.deepEqual(v2, version2);
  t.is(v2.toString(), version2.toString());
  const v1 = convertToResultVersion1(base);
  t.deepEqual(v1, version1);
  t.is(v1.toString(), version1.toString());
  const v0 = convertToResultVersion0(base);
  t.deepEqual(v0, version0);
  t.is(v0.toString(), version0.toString());
});

// @ts-check

import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import test from "ava";
import markdownIt from "markdown-it";
import { lint as lintAsync } from "markdownlint/async";
import { lint as lintPromise } from "markdownlint/promise";
import { lint as lintSync } from "markdownlint/sync";
import customRules from "./rules/rules.cjs";
import { newLineRe } from "../helpers/helpers.cjs";
import { __filename, importWithTypeJson } from "./esm-helpers.mjs";
const packageJson = await importWithTypeJson(import.meta, "../package.json");
const { homepage, version } = packageJson;

const markdownItFactory = () => markdownIt({ "html": true });

test("customRulesV0", (t) => new Promise((resolve) => {
  t.plan(4);
  const customRulesMd = "./test/custom-rules.md";
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    markdownItFactory,
    // @ts-ignore
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = {
      "any-blockquote-markdown-it": [ 12 ],
      "any-blockquote-micromark": [ 12 ],
      "every-n-lines": [ 2, 4, 6, 10, 12 ],
      "first-line": [ 1 ],
      "letters-E-X": [ 3, 7 ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    // @ts-ignore
    let actualMessage = actualResult.toString();
    let expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote-markdown-it" +
      " Rule that reports an error for any blockquote\n" +
      "./test/custom-rules.md: 12: any-blockquote-micromark" +
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
    t.is(actualMessage, expectedMessage, "Incorrect message (name).");
    // @ts-ignore
    actualMessage = actualResult.toString(true);
    expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote-markdown-it" +
      " Rule that reports an error for any blockquote\n" +
      "./test/custom-rules.md: 12: any-blockquote-micromark" +
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
    t.is(actualMessage, expectedMessage, "Incorrect message (alias).");
    resolve();
  });
}));

test("customRulesV1", (t) => new Promise((resolve) => {
  t.plan(3);
  const customRulesMd = "./test/custom-rules.md";
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    markdownItFactory,
    // @ts-ignore
    "resultVersion": 1
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = [
      { "lineNumber": 12,
        "ruleName": "any-blockquote-markdown-it",
        "ruleAlias": "any-blockquote-markdown-it",
        "ruleDescription": "Rule that reports an error for any blockquote",
        "ruleInformation":
          `${homepage}/blob/main/test/rules/any-blockquote.js`,
        "errorDetail": "Blockquote spans 1 line(s).",
        "errorContext": "> Blockquote",
        "errorRange": null },
      { "lineNumber": 12,
        "ruleName": "any-blockquote-micromark",
        "ruleAlias": "any-blockquote-micromark",
        "ruleDescription": "Rule that reports an error for any blockquote",
        "ruleInformation":
          `${homepage}/blob/main/test/rules/any-blockquote.js`,
        "errorDetail": "Blockquote spans 1 line(s).",
        "errorContext": "> Blockquote",
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
        "ruleInformation": `${homepage}/blob/main/test/rules/letters-E-X.js`,
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null },
      { "lineNumber": 7,
        "ruleName": "letters-E-X",
        "ruleAlias": "letter-E-letter-X",
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "ruleInformation": `${homepage}/blob/main/test/rules/letters-E-X.js`,
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null }
    ];
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    // @ts-ignore
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote-markdown-it/any-blockquote-markdown-it" +
      " Rule that reports an error for any blockquote" +
      " [Blockquote spans 1 line(s).] [Context: \"> Blockquote\"]\n" +
      "./test/custom-rules.md: 12: any-blockquote-micromark/any-blockquote-micromark" +
      " Rule that reports an error for any blockquote" +
      " [Blockquote spans 1 line(s).] [Context: \"> Blockquote\"]\n" +
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
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    resolve();
  });
}));

test("customRulesV2", (t) => new Promise((resolve) => {
  t.plan(3);
  const customRulesMd = "./test/custom-rules.md";
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    markdownItFactory,
    // @ts-ignore
    "resultVersion": 2
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = [
      { "lineNumber": 12,
        "ruleNames": [ "any-blockquote-markdown-it" ],
        "ruleDescription": "Rule that reports an error for any blockquote",
        "ruleInformation":
          `${homepage}/blob/main/test/rules/any-blockquote.js`,
        "errorDetail": "Blockquote spans 1 line(s).",
        "errorContext": "> Blockquote",
        "errorRange": null },
      { "lineNumber": 12,
        "ruleNames": [ "any-blockquote-micromark" ],
        "ruleDescription": "Rule that reports an error for any blockquote",
        "ruleInformation":
          `${homepage}/blob/main/test/rules/any-blockquote.js`,
        "errorDetail": "Blockquote spans 1 line(s).",
        "errorContext": "> Blockquote",
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
        "ruleInformation": `${homepage}/blob/main/test/rules/letters-E-X.js`,
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null },
      { "lineNumber": 7,
        "ruleNames": [ "letters-E-X", "letter-E-letter-X", "contains-ex" ],
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "ruleInformation": `${homepage}/blob/main/test/rules/letters-E-X.js`,
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null }
    ];
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    // @ts-ignore
    const actualMessage = actualResult.toString();
    const expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote-markdown-it" +
      " Rule that reports an error for any blockquote" +
      " [Blockquote spans 1 line(s).] [Context: \"> Blockquote\"]\n" +
      "./test/custom-rules.md: 12: any-blockquote-micromark" +
      " Rule that reports an error for any blockquote" +
      " [Blockquote spans 1 line(s).] [Context: \"> Blockquote\"]\n" +
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
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    resolve();
  });
}));

test("customRulesConfig", (t) => new Promise((resolve) => {
  t.plan(2);
  const customRulesMd = "./test/custom-rules.md";
  /** @type {import("markdownlint").Options} */
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
    markdownItFactory,
    // @ts-ignore
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = {
      "any-blockquote-markdown-it": [ 12 ],
      "any-blockquote-micromark": [ 12 ],
      "every-n-lines": [ 3, 6, 12 ],
      "first-line": [ 1 ],
      "letters-E-X": [ 7 ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("customRulesNpmPackage", (t) => new Promise((resolve) => {
  t.plan(2);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      require("./rules/npm"),
      require("markdownlint-rule-extended-ascii")
    ],
    markdownItFactory,
    "strings": {
      "string": "# Text\n\n---\n\nText ✅\n"
    },
    // @ts-ignore
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult.string = {
      "extended-ascii": [ 5 ],
      "sample-rule": [ 3 ]
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("customRulesBadProperty", (t) => {
  t.plan(30);
  for (const testCase of [
    {
      "propertyName": "names",
      "propertyValues":
        [ null, "string", [], [ null ], [ "" ], [ "string", 10 ] ]
    },
    {
      "propertyName": "description",
      "propertyValues": [ null, 10, "", [] ]
    },
    {
      "propertyName": "information",
      "propertyValues": [ 10, [], "string", "https://example.com" ]
    },
    {
      "propertyName": "asynchronous",
      "propertyValues": [ null, 10, "", [] ]
    },
    {
      "propertyName": "tags",
      "propertyValues":
        [ null, "string", [], [ null ], [ "" ], [ "string", 10 ] ]
    },
    {
      "propertyName": "parser",
      "propertyValues":
        [ 10, "string", [] ]
    },
    {
      "propertyName": "function",
      "propertyValues": [ null, "string", [] ]
    }
  ]) {
    const { propertyName, propertyValues } = testCase;
    for (const propertyValue of propertyValues) {
      const badRule = { ...customRules.firstLine };
      badRule[propertyName] = propertyValue;
      /** @type {import("markdownlint").Options} */
      const options = {
        "customRules": [ badRule ]
      };
      t.throws(
        function badRuleCall() {
          lintSync(options);
        },
        {
          "message":
            `Property '${propertyName}' of custom rule at index 0 is incorrect: '${propertyValue}'.`
        },
        `Did not get correct exception for property '${propertyName}' value '${propertyValue}'.`
      );
    }
  }
});

test("customRulesUsedNameName", (t) => new Promise((resolve) => {
  t.plan(4);
  lintAsync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name", "NO-missing-SPACE-atx" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    t.truthy(err, "Did not get an error for duplicate name.");
    t.true(err instanceof Error, "Error not instance of Error.");
    // @ts-ignore
    t.is(err.message,
      "Name 'NO-missing-SPACE-atx' of custom rule at index 0 is " +
        "already used as a name or tag.",
      "Incorrect message for duplicate name.");
    t.true(!result, "Got result for duplicate name.");
    resolve();
  });
}));

test("customRulesUsedNameTag", (t) => new Promise((resolve) => {
  t.plan(4);
  lintAsync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name", "HtMl" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    t.truthy(err, "Did not get an error for duplicate name.");
    t.true(err instanceof Error, "Error not instance of Error.");
    // @ts-ignore
    t.is(err.message,
      "Name 'HtMl' of custom rule at index 0 is already used as a name or tag.",
      "Incorrect message for duplicate name.");
    t.true(!result, "Got result for duplicate name.");
    resolve();
  });
}));

test("customRulesUsedTagName", (t) => new Promise((resolve) => {
  t.plan(4);
  lintAsync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "filler" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function noop() {}
      },
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag", "NO-missing-SPACE-atx" ],
        "parser": "none",
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    t.truthy(err, "Did not get an error for duplicate tag.");
    t.true(err instanceof Error, "Error not instance of Error.");
    // @ts-ignore
    t.is(err.message,
      "Tag 'NO-missing-SPACE-atx' of custom rule at index 1 is " +
        "already used as a name.",
      "Incorrect message for duplicate name.");
    t.true(!result, "Got result for duplicate tag.");
    resolve();
  });
}));

test("customRulesParserUndefined", (t) => {
  t.plan(5);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      // @ts-ignore
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function":
          (params) => {
            t.true(Object.keys(params).includes("tokens"));
            t.is(Object.keys(params.parsers).length, 1);
            t.truthy(params.parsers.markdownit);
            t.is(Object.keys(params.parsers.markdownit).length, 1);
            t.truthy(params.parsers.markdownit.tokens);
          }
      }
    ],
    markdownItFactory,
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintPromise(options);
});

test("customRulesParserNone", (t) => {
  t.plan(2);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function":
          (params) => {
            t.false(Object.keys(params).includes("tokens"));
            t.is(Object.keys(params.parsers).length, 0);
          }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintPromise(options);
});

test("customRulesParserMarkdownIt", (t) => {
  t.plan(5);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function":
          (params) => {
            t.false(Object.keys(params).includes("tokens"));
            t.is(Object.keys(params.parsers).length, 1);
            t.truthy(params.parsers.markdownit);
            t.is(Object.keys(params.parsers.markdownit).length, 1);
            t.truthy(params.parsers.markdownit.tokens);
          }
      }
    ],
    markdownItFactory,
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintPromise(options);
});

test("customRulesParserMicromark", (t) => {
  t.plan(5);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "micromark",
        "function":
          (params) => {
            t.false(Object.keys(params).includes("tokens"));
            t.is(Object.keys(params.parsers).length, 1);
            t.truthy(params.parsers.micromark);
            t.is(Object.keys(params.parsers.micromark).length, 1);
            t.truthy(params.parsers.micromark.tokens);
          }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintPromise(options);
});

test("customRulesMarkdownItFactoryUndefined", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function": () => {}
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  };
  t.throws(
    () => lintSync(options),
    {
      "message": "The option 'markdownItFactory' was required (due to the option 'customRules' including a rule requiring the 'markdown-it' parser), but 'markdownItFactory' was not set."
    },
    "No exception when markdownItFactory is undefined."
  );
});

test("customRulesMarkdownItFactoryNotNeededSync", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": () => {}
      }
    ],
    "markdownItFactory": () => t.fail(),
    "strings": {
      "string": "# Heading\n"
    }
  };
  t.pass();
  return lintSync(options);
});

test("customRulesMarkdownItFactoryNeededSync", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function": () => {}
      }
    ],
    "markdownItFactory": () => t.pass() && markdownIt(),
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintSync(options);
});

test("customRulesMarkdownItFactoryNotNeededAsync", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": () => {}
      }
    ],
    "markdownItFactory": () => t.fail(),
    "strings": {
      "string": "# Heading\n"
    }
  };
  t.pass();
  return lintPromise(options);
});

test("customRulesMarkdownItFactoryNeededAsyncRunsSync", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function": () => {}
      }
    ],
    "markdownItFactory": () => t.pass() && markdownIt(),
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintPromise(options);
});

test("customRulesMarkdownItFactoryNeededAsyncRunsAsync", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function": () => {}
      }
    ],
    "markdownItFactory": () => t.pass() && Promise.resolve(markdownIt()),
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintPromise(options);
});

test("customRulesMarkdownItFactoryNeededAsyncRunsAsyncWithImport", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function": () => {}
      }
    ],
    "markdownItFactory": () => import("markdown-it").then((module) => t.pass() && module.default()),
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintPromise(options);
});

test("customRulesMarkdownItInstanceCanBeReusedSync", (t) => {
  t.plan(1);
  const markdownItInstance = markdownItFactory();
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function": () => {}
      }
    ],
    "markdownItFactory": () => markdownItInstance,
    "strings": {
      "string": "# Heading"
    }
  };
  t.deepEqual(lintSync(options), lintSync(options));
});

test("customRulesMarkdownItInstanceCanBeReusedAsync", async(t) => {
  t.plan(1);
  const markdownItInstance = markdownItFactory();
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function": () => {}
      }
    ],
    "markdownItFactory": () => Promise.resolve(markdownItInstance),
    "strings": {
      "string": "# Heading"
    }
  };
  t.deepEqual(await lintPromise(options), await lintPromise(options));
});

test("customRulesMarkdownItParamsTokensSameObject", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      // @ts-ignore
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function":
          (params) => {
            // @ts-ignore
            t.is(params.tokens, params.parsers.markdownit.tokens);
          }
      }
    ],
    markdownItFactory,
    "strings": {
      "string": "# Heading\n"
    }
  };
  return lintPromise(options);
});

test("customRulesMarkdownItTokensSnapshot", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function":
          (params) => {
            t.snapshot(params.parsers.markdownit.tokens, "Unexpected tokens");
          }
      }
    ],
    markdownItFactory,
    "noInlineConfig": true
  };
  return fs
    .readFile("./test/every-markdown-syntax.md", "utf8")
    .then((content) => {
      options.strings = { "content": content.split(newLineRe).join("\n") };
      return lintPromise(options);
    });
});

test("customRulesMicromarkTokensSnapshot", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "micromark",
        "function":
          (params) => {
            t.snapshot(params.parsers.micromark.tokens, "Unexpected tokens");
          }
      }
    ],
    "noInlineConfig": true
  };
  return fs
    .readFile("./test/every-markdown-syntax.md", "utf8")
    .then((content) => {
      options.strings = { "content": content.split(newLineRe).join("\n") };
      return lintPromise(options);
    });
});

test("customRulesDefinitionStatic", (t) => new Promise((resolve) => {
  t.plan(2);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "information": new URL("https://example.com/information"),
        "tags": [ "tag" ],
        "parser": "none",
        "function": (params, onError) => {
          // @ts-ignore
          const definition = options.customRules[0];
          definition.names[0] = "changed";
          definition.description = "changed";
          definition.information.pathname = "changed";
          onError({
            "lineNumber": 1
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  };
  lintAsync(options, (err, actualResult) => {
    t.falsy(err);
    const expectedResult = {
      "string": [
        {
          "lineNumber": 1,
          "ruleNames": [ "name" ],
          "ruleDescription": "description",
          "ruleInformation": "https://example.com/information",
          "errorDetail": null,
          "errorContext": null,
          "errorRange": null,
          "fixInfo": null
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("customRulesThrowForFile", (t) => new Promise((resolve) => {
  t.plan(4);
  const exceptionMessage = "Test exception message";
  lintAsync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function throws() {
          throw new Error(exceptionMessage);
        }
      }
    ],
    "files": [ "./test/custom-rules.md" ]
  }, function callback(err, result) {
    t.truthy(err, "Did not get an error for function thrown.");
    t.true(err instanceof Error, "Error not instance of Error.");
    // @ts-ignore
    t.is(err.message, exceptionMessage,
      "Incorrect message for function thrown.");
    t.true(!result, "Got result for function thrown.");
    resolve();
  });
}));

test("customRulesThrowForFileSync", (t) => {
  t.plan(1);
  const exceptionMessage = "Test exception message";
  t.throws(
    function customRuleThrowsCall() {
      lintSync({
        /** @type {import("markdownlint").Rule[]} */
        "customRules": [
          {
            "names": [ "name" ],
            "description": "description",
            "tags": [ "tag" ],
            "parser": "none",
            "function": function throws() {
              throw new Error(exceptionMessage);
            }
          }
        ],
        "files": [ "./test/custom-rules.md" ]
      });
    },
    {
      "message": exceptionMessage
    },
    "Did not get correct exception for function thrown."
  );
});

test("customRulesThrowForString", (t) => new Promise((resolve) => {
  t.plan(4);
  const exceptionMessage = "Test exception message";
  lintAsync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function throws() {
          throw new Error(exceptionMessage);
        }
      }
    ],
    "strings": {
      "string": "String"
    }
  }, function callback(err, result) {
    t.truthy(err, "Did not get an error for function thrown.");
    t.true(err instanceof Error, "Error not instance of Error.");
    // @ts-ignore
    t.is(err.message, exceptionMessage,
      "Incorrect message for function thrown.");
    t.true(!result, "Got result for function thrown.");
    resolve();
  });
}));

test("customRulesThrowForStringSync", (t) => {
  t.plan(1);
  const exceptionMessage = "Test exception message";
  t.throws(
    function customRuleThrowsCall() {
      lintSync({
        /** @type {import("markdownlint").Rule[]} */
        "customRules": [
          {
            "names": [ "name" ],
            "description": "description",
            "tags": [ "tag" ],
            "parser": "none",
            "function": function throws() {
              throw new Error(exceptionMessage);
            }
          }
        ],
        "strings": {
          "string": "String"
        }
      });
    },
    {
      "message": exceptionMessage
    },
    "Did not get correct exception for function thrown."
  );
});

test("customRulesOnErrorNull", (t) => new Promise((resolve) => {
  t.plan(4);
  lintAsync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function onErrorNull(params, onError) {
          // @ts-ignore
          onError(null);
        }
      }
    ],
    "strings": {
      "string": "String"
    }
  },
  function callback(err, result) {
    t.truthy(err, "Did not get an error for function thrown.");
    t.true(err instanceof Error, "Error not instance of Error.");
    t.is(
      // @ts-ignore
      err.message,
      "Value of 'lineNumber' passed to onError by 'NAME' is incorrect for 'string'.",
      "Did not get correct exception for null object."
    );
    t.true(!result, "Got result for function thrown.");
    resolve();
  });
}));

test("customRulesOnErrorNullSync", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function onErrorNull(params, onError) {
          // @ts-ignore
          onError(null);
        }
      }
    ],
    "strings": {
      "string": "String"
    }
  };
  t.throws(
    function nullErrorCall() {
      lintSync(options);
    },
    {
      "message": "Value of 'lineNumber' passed to onError by 'NAME' is incorrect for 'string'."
    },
    "Did not get correct exception for null object."
  );
});

test("customRulesOnErrorBad", (t) => {
  t.plan(25);
  for (const testCase of [
    {
      "propertyName": "lineNumber",
      "propertyValues": [ null, "string" ]
    },
    {
      "propertyName": "detail",
      "propertyValues": [ 10, [] ]
    },
    {
      "propertyName": "context",
      "propertyValues": [ 10, [] ]
    },
    {
      "propertyName": "information",
      "propertyValues": [ 10, [], "string", "https://example.com" ]
    },
    {
      "propertyName": "range",
      "propertyValues": [ 10, [], [ 10 ], [ 10, null ], [ 10, 11, 12 ] ]
    },
    {
      "propertyName": "fixInfo",
      "propertyValues": [ 10, "string" ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "lineNumber",
      "propertyValues": [ null, "string" ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "editColumn",
      "propertyValues": [ null, "string" ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "deleteCount",
      "propertyValues": [ null, "string" ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "insertText",
      "propertyValues": [ 10, [] ]
    }
  ]) {
    const { propertyName, subPropertyName, propertyValues } = testCase;
    for (const propertyValue of propertyValues) {
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
      /** @type {import("markdownlint").Options} */
      const options = {
        "customRules": [
          {
            "names": [ "name" ],
            "description": "description",
            "tags": [ "tag" ],
            "parser": "none",
            "function": function onErrorBad(params, onError) {
              onError(badObject);
            }
          }
        ],
        "strings": {
          "string": "String"
        }
      };
      t.throws(
        function badErrorCall() {
          lintSync(options);
        },
        {
          "message":
            `Value of '${propertyNames}' passed to onError by 'NAME' is incorrect for 'string'.`
        },
        "Did not get correct exception for bad object."
      );
    }
  }
});

test("customRulesOnErrorInvalid", (t) => {
  t.plan(17);
  for (const testCase of [
    {
      "propertyName": "lineNumber",
      "propertyValues": [ -1, 0, 3, 4 ]
    },
    {
      "propertyName": "range",
      "propertyValues": [ [ 0, 1 ], [ 1, 0 ], [ 5, 1 ], [ 1, 5 ], [ 4, 2 ] ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "lineNumber",
      "propertyValues": [ -1, 0, 3, 4 ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "editColumn",
      "propertyValues": [ 0, 6 ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "deleteCount",
      "propertyValues": [ -2, 5 ]
    }
  ]) {
    const { propertyName, subPropertyName, propertyValues } = testCase;
    for (const propertyValue of propertyValues) {
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
      /** @type {import("markdownlint").Options} */
      const options = {
        "customRules": [
          {
            "names": [ "name" ],
            "description": "description",
            "tags": [ "tag" ],
            "parser": "none",
            "function": function onErrorInvalid(params, onError) {
              onError(badObject);
            }
          }
        ],
        "strings": {
          "string": "Text\ntext"
        }
      };
      t.throws(
        function invalidErrorCall() {
          lintSync(options);
        },
        {
          "message":
            `Value of '${propertyNames}' passed to onError by 'NAME' is incorrect for 'string'.`
        },
        "Did not get correct exception for invalid object."
      );
    }
  }
});

test("customRulesOnErrorValid", (t) => {
  t.plan(24);
  for (const testCase of [
    {
      "propertyName": "lineNumber",
      "propertyValues": [ 1, 2 ]
    },
    {
      "propertyName": "range",
      "propertyValues": [ [ 1, 1 ], [ 1, 4 ], [ 2, 2 ], [ 3, 2 ], [ 4, 1 ] ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "lineNumber",
      "propertyValues": [ 1, 2 ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "editColumn",
      "propertyValues": [ 1, 2, 4, 5 ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "deleteCount",
      "propertyValues": [ -1, 0, 1, 4 ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": "insertText",
      "propertyValues":
        [ "", "1", "123456", "\n", "\nText", "Text\n", "\nText\n" ]
    }
  ]) {
    const { propertyName, subPropertyName, propertyValues } = testCase;
    for (const propertyValue of propertyValues) {
      const goodObject = {
        "lineNumber": 1
      };
      if (subPropertyName) {
        goodObject[propertyName] = {};
        goodObject[propertyName][subPropertyName] = propertyValue;
      } else {
        goodObject[propertyName] = propertyValue;
      }
      /** @type {import("markdownlint").Options} */
      const options = {
        "customRules": [
          {
            "names": [ "name" ],
            "description": "description",
            "tags": [ "tag" ],
            "parser": "none",
            "function": function onErrorValid(params, onError) {
              onError(goodObject);
            }
          }
        ],
        "strings": {
          "string": "Text\ntext"
        }
      };
      lintSync(options);
      t.truthy(true);
    }
  }
});

test("customRulesOnErrorLazy", (t) => new Promise((resolve) => {
  t.plan(2);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function onErrorLazy(params, onError) {
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
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "string": [
        {
          "lineNumber": 1,
          "ruleNames": [ "name" ],
          "ruleDescription": "description",
          "ruleInformation": null,
          "errorDetail": null,
          "errorContext": null,
          "errorRange": [ 1, 1 ],
          "fixInfo": null
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("customRulesOnErrorModified", (t) => new Promise((resolve) => {
  t.plan(2);
  const errorObject = {
    "lineNumber": 1,
    "detail": "detail",
    "context": "context",
    "information": new URL("https://example.com/information"),
    "range": [ 1, 2 ],
    "fixInfo": {
      "editColumn": 1,
      "deleteCount": 2,
      "insertText": "text"
    }
  };
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function onErrorModified(params, onError) {
          onError(errorObject);
          errorObject.lineNumber = 2;
          errorObject.detail = "changed";
          errorObject.context = "changed";
          errorObject.information = new URL("https://example.com/changed");
          errorObject.range[1] = 3;
          errorObject.fixInfo.editColumn = 2;
          errorObject.fixInfo.deleteCount = 3;
          errorObject.fixInfo.insertText = "changed";
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "string": [
        {
          "lineNumber": 1,
          "ruleNames": [ "name" ],
          "ruleDescription": "description",
          "ruleInformation": "https://example.com/information",
          "errorDetail": "detail",
          "errorContext": "context",
          "errorRange": [ 1, 2 ],
          "fixInfo": {
            "editColumn": 1,
            "deleteCount": 2,
            "insertText": "text"
          }
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("customRulesOnErrorInvalidHandled", (t) => new Promise((resolve) => {
  t.plan(2);
  lintAsync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function onErrorInvalid(params, onError) {
          onError({
            "lineNumber": 13
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    },
    "handleRuleFailures": true
  }, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "string": [
        {
          "lineNumber": 1,
          "ruleNames": [ "name" ],
          "ruleDescription": "description",
          "ruleInformation": null,
          "errorDetail": "This rule threw an exception: " +
            "Value of 'lineNumber' passed to onError by 'NAME' is incorrect for 'string'.",
          "errorContext": null,
          "errorRange": null,
          "fixInfo": null
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("customRulesOnErrorInvalidHandledSync", (t) => {
  t.plan(1);
  const actualResult = lintSync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
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
  });
  const expectedResult = {
    "string": [
      {
        "lineNumber": 1,
        "ruleNames": [ "name" ],
        "ruleDescription": "description",
        "ruleInformation": null,
        "errorDetail": "This rule threw an exception: " +
          "Value of 'lineNumber' passed to onError by 'NAME' is incorrect for 'string'.",
        "errorContext": null,
        "errorRange": null,
        "fixInfo": null
      }
    ]
  };
  t.deepEqual(actualResult, expectedResult, "Undetected issues.");
});

test("customRulesVersion", (t) => new Promise((resolve) => {
  t.plan(2);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function stringName(params) {
          t.is(params.version, version, "Incorrect version");
        }
      }
    ],
    "files": "doc/CustomRules.md"
  };
  lintAsync(options, function callback(err) {
    t.falsy(err);
    resolve();
  });
}));

test("customRulesFileName", (t) => new Promise((resolve) => {
  t.plan(2);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function stringName(params) {
          t.is(params.name, "doc/CustomRules.md", "Incorrect file name");
        }
      }
    ],
    "files": "doc/CustomRules.md"
  };
  lintAsync(options, function callback(err) {
    t.falsy(err);
    resolve();
  });
}));

test("customRulesStringName", (t) => new Promise((resolve) => {
  t.plan(2);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": function stringName(params) {
          t.is(params.name, "string", "Incorrect string name");
        }
      }
    ],
    "strings": {
      "string": "# Heading"
    }
  };
  lintAsync(options, function callback(err) {
    t.falsy(err);
    resolve();
  });
}));

test("customRulesOnErrorInformationNotRuleNotError", (t) => {
  t.plan(1);
  const actualResult = lintSync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": (params, onError) => {
          onError({
            "lineNumber": 1
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  });
  t.true(actualResult.string[0].ruleInformation === null, "Unexpected URL.");
});

test("customRulesOnErrorInformationRuleNotError", (t) => {
  t.plan(1);
  const actualResult = lintSync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "information": new URL("https://example.com/rule"),
        "parser": "none",
        "function": (params, onError) => {
          onError({
            "lineNumber": 1
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  });
  t.is(
    actualResult.string[0].ruleInformation,
    "https://example.com/rule",
    "Unexpected URL."
  );
});

test("customRulesOnErrorInformationNotRuleError", (t) => {
  t.plan(1);
  const actualResult = lintSync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": (params, onError) => {
          onError({
            "lineNumber": 1,
            "information": new URL("https://example.com/error")
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  });
  t.is(
    actualResult.string[0].ruleInformation,
    "https://example.com/error",
    "Unexpected URL."
  );
});

test("customRulesOnErrorInformationRuleError", (t) => {
  t.plan(1);
  const actualResult = lintSync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "information": new URL("https://example.com/rule"),
        "parser": "none",
        "function": (params, onError) => {
          onError({
            "lineNumber": 1,
            "information": new URL("https://example.com/error")
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  });
  t.is(
    actualResult.string[0].ruleInformation,
    "https://example.com/error",
    "Unexpected URL."
  );
});

test("customRulesOnErrorInformationRuleErrorUndefined", (t) => {
  t.plan(1);
  const actualResult = lintSync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "information": new URL("https://example.com/rule"),
        "parser": "none",
        "function": (params, onError) => {
          onError({
            "lineNumber": 1,
            "information": undefined
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    }
  });
  t.is(
    actualResult.string[0].ruleInformation,
    "https://example.com/rule",
    "Unexpected URL."
  );
});

test("customRulesOnErrorInformationRuleErrorMultiple", (t) => {
  t.plan(6);
  const actualResult = lintSync({
    /** @type {import("markdownlint").Rule[]} */
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "information": new URL("https://example.com/rule"),
        "parser": "none",
        "function": (params, onError) => {
          onError({
            "lineNumber": 1,
            "information": new URL("https://example.com/errorA")
          });
          onError({
            "lineNumber": 3,
            "information": new URL("https://example.com/errorB")
          });
          onError({
            "lineNumber": 5
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading\n\nText\n\nText\n"
    }
  });
  t.is(
    actualResult.string[0].lineNumber,
    1,
    "Unexpected line number."
  );
  t.is(
    actualResult.string[0].ruleInformation,
    "https://example.com/errorA",
    "Unexpected URL."
  );
  t.is(
    actualResult.string[1].lineNumber,
    3,
    "Unexpected line number."
  );
  t.is(
    actualResult.string[1].ruleInformation,
    "https://example.com/errorB",
    "Unexpected URL."
  );
  t.is(
    actualResult.string[2].lineNumber,
    5,
    "Unexpected line number."
  );
  t.is(
    actualResult.string[2].ruleInformation,
    "https://example.com/rule",
    "Unexpected URL."
  );
});

test("customRulesDoc", (t) => new Promise((resolve) => {
  t.plan(2);
  lintAsync({
    "files": "./doc/CustomRules.md",
    "config": {
      "MD013": { "line_length": 200 }
    }
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = { "./doc/CustomRules.md": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
    resolve();
  });
}));

test("customRulesLintJavaScript", (t) => new Promise((resolve) => {
  t.plan(2);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": customRules.lintJavaScript,
    "files": "test/lint-javascript.md",
    markdownItFactory
  };
  lintAsync(options, (err, actual) => {
    t.falsy(err);
    const expected = {
      "test/lint-javascript.md": [
        {
          "lineNumber": 12,
          "ruleNames": [ "lint-javascript" ],
          "ruleDescription": "Rule that lints JavaScript code",
          "ruleInformation": null,
          "errorDetail": "'console' is not defined.",
          "errorContext": "console.log(x);",
          "errorRange": null,
          "fixInfo": null
        }
      ]
    };
    t.deepEqual(actual, expected, "Unexpected issues.");
    resolve();
  });
}));

test("customRulesValidateJson", (t) => new Promise((resolve) => {
  t.plan(3);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": customRules.validateJson,
    "files": "test/validate-json.md",
    markdownItFactory
  };
  lintAsync(options, (err, actual) => {
    t.falsy(err);
    const expected = {
      "test/validate-json.md": [
        {
          "lineNumber": 22,
          "ruleNames": [ "validate-json" ],
          "ruleDescription": "Rule that validates JSON code",
          "ruleInformation": null,
          "errorContext": null,
          "errorRange": null,
          "fixInfo": null
        }
      ]
    };
    t.true(
      actual && (actual["test/validate-json.md"][0].errorDetail.length > 0),
      "Missing errorDetail"
    );
    // @ts-ignore
    delete actual["test/validate-json.md"][0].errorDetail;
    t.deepEqual(actual, expected, "Unexpected issues.");
    resolve();
  });
}));

test("customRulesAsyncThrowsInSyncContext", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name1", "name2" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "asynchronous": true,
        "function": () => {}
      }
    ],
    "strings": {
      "string": "Unused"
    }
  };
  t.throws(
    () => lintSync(options),
    {
      "message": "Custom rule name1/name2 at index 0 is asynchronous and " +
        "can not be used in a synchronous context."
    },
    "Did not get correct exception for async rule in sync context."
  );
});

test("customRulesParamsAreFrozen", (t) => {
  const assertParamsFrozen = (params) => {
    const pending = [ params ];
    let current = null;
    while ((current = pending.shift())) {
      t.true(Object.isFrozen(current) || (current === params));
      for (const name of Object.getOwnPropertyNames(current)) {
        const value = current[name];
        if (
          value &&
          (typeof value === "object") &&
          (name !== "parent")
        ) {
          pending.push(value);
        }
      }
    }
  };
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "none" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "none",
        "function": assertParamsFrozen
      },
      {
        "names": [ "markdownit" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "markdownit",
        "function": assertParamsFrozen
      },
      {
        "names": [ "micromark" ],
        "description": "description",
        "tags": [ "tag" ],
        "parser": "micromark",
        "function": assertParamsFrozen
      }
    ],
    "files": [ "README.md" ],
    markdownItFactory
  };
  return lintPromise(options);
});

test("customRulesParamsAreStable", (t) => {
  t.plan(4);
  const config1 = { "value1": 10 };
  const config2 = { "value2": 20 };
  /** @type {import("markdownlint").Options} */
  const options = {
    "config": {
      "MD010": true,
      "name1": config1,
      "MD013": { "line_length": 200 },
      "name2": config2,
      "MD033": false
    },
    "customRules": [
      {
        "names": [ "name1" ],
        "description": "description1",
        "tags": [ "tag" ],
        "asynchronous": true,
        "parser": "none",
        "function":
          (params) => {
            const { config } = params;
            t.deepEqual(
              config,
              config1,
              `Unexpected config in sync path: ${config}.`
            );
            return Promise.resolve().then(() => {
              t.deepEqual(
                config,
                config1,
                `Unexpected config in async path: ${config}.`
              );
            });
          }
      },
      {
        "names": [ "name2" ],
        "description": "description2",
        "tags": [ "tag" ],
        "asynchronous": true,
        "parser": "none",
        "function":
          (params) => {
            const { config } = params;
            t.deepEqual(
              config,
              config2,
              `Unexpected config in sync path: ${config}.`
            );
            return Promise.resolve().then(() => {
              t.deepEqual(
                config,
                config2,
                `Unexpected config in async path: ${config}.`
              );
            });
          }
      }
    ],
    "strings": {
      "string": "# Heading"
    }
  };
  return lintPromise(options);
});

test("customRulesAsyncReadFiles", (t) => {
  t.plan(3);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "name1" ],
        "description": "description1",
        "information": new URL("https://example.com/asyncRule1"),
        "tags": [ "tag" ],
        "asynchronous": true,
        "parser": "none",
        "function":
          (params, onError) => fs.readFile(__filename(import.meta), "utf8").then(
            (content) => {
              t.true(content.length > 0);
              onError({
                "lineNumber": 1,
                "detail": "detail1",
                "context": "context1",
                "range": [ 2, 3 ]
              });
            }
          )
      },
      {
        "names": [ "name2" ],
        "description": "description2",
        "tags": [ "tag" ],
        "asynchronous": true,
        "parser": "none",
        "function":
          async(params, onError) => {
            const content = await fs.readFile(__filename(import.meta), "utf8");
            t.true(content.length > 0);
            onError({
              "lineNumber": 1,
              "detail": "detail2",
              "context": "context2"
            });
          }
      }
    ],
    "strings": {
      "string": "# Heading"
    }
  };
  const expected = {
    "string": [
      {
        "lineNumber": 1,
        "ruleNames": [ "MD047", "single-trailing-newline" ],
        "ruleDescription": "Files should end with a single newline character",
        "ruleInformation": `${homepage}/blob/v${version}/doc/md047.md`,
        "errorDetail": null,
        "errorContext": null,
        "errorRange": [ 9, 1 ],
        "fixInfo": {
          "editColumn": 10,
          "insertText": "\n"
        }
      },
      {
        "lineNumber": 1,
        "ruleNames": [ "name1" ],
        "ruleDescription": "description1",
        "ruleInformation": "https://example.com/asyncRule1",
        "errorDetail": "detail1",
        "errorContext": "context1",
        "errorRange": [ 2, 3 ],
        "fixInfo": null
      },
      {
        "lineNumber": 1,
        "ruleNames": [ "name2" ],
        "ruleDescription": "description2",
        "ruleInformation": null,
        "errorDetail": "detail2",
        "errorContext": "context2",
        "errorRange": null,
        "fixInfo": null
      }
    ]
  };
  return lintPromise(options)
    .then((actual) => t.deepEqual(actual, expected, "Unexpected issues."));
});

test("customRulesAsyncIgnoresSyncReturn", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "sync" ],
        "description": "description",
        "information": new URL("https://example.com/asyncRule"),
        "tags": [ "tag" ],
        "asynchronous": false,
        "parser": "none",
        "function": () => new Promise(() => {
          // Never resolves
        })
      },
      {
        "names": [ "async" ],
        "description": "description",
        "information": new URL("https://example.com/asyncRule"),
        "tags": [ "tag" ],
        "asynchronous": true,
        "parser": "none",
        "function": (params, onError) => new Promise((resolve) => {
          onError({ "lineNumber": 1 });
          resolve(null);
        })
      }
    ],
    "strings": {
      "string": "# Heading"
    }
  };
  const expected = {
    "string": [
      {
        "lineNumber": 1,
        "ruleNames": [ "async" ],
        "ruleDescription": "description",
        "ruleInformation": "https://example.com/asyncRule",
        "errorDetail": null,
        "errorContext": null,
        "errorRange": null,
        "fixInfo": null
      },
      {
        "lineNumber": 1,
        "ruleNames": [ "MD047", "single-trailing-newline" ],
        "ruleDescription": "Files should end with a single newline character",
        "ruleInformation": `${homepage}/blob/v${version}/doc/md047.md`,
        "errorDetail": null,
        "errorContext": null,
        "errorRange": [ 9, 1 ],
        "fixInfo": {
          "editColumn": 10,
          "insertText": "\n"
        }
      }
    ]
  };
  return lintPromise(options)
    .then((actual) => t.deepEqual(actual, expected, "Unexpected issues."));
});

const errorMessage = "Custom error message.";
const stringScenarios = [
  [
    "Files",
    [ "./test/custom-rules.md" ],
    null
  ],
  [
    "Strings",
    null,
    { "./test/custom-rules.md": "# Heading\n" }
  ]
];

for (const flavor of [
  [
    "customRulesThrowString",
    () => {
      throw errorMessage;
    }
  ],
  [
    "customRulesThrowError",
    () => {
      throw new Error(errorMessage);
    }
  ]
]) {
  const [ name, func ] = flavor;
  /** @type {import("markdownlint").Rule[]} */
  const customRule = [
    {
      "names": [ "name" ],
      "description": "description",
      "tags": [ "tag" ],
      "parser": "none",
      // @ts-ignore
      "function": func
    }
  ];
  const expectedResult = {
    "./test/custom-rules.md": [
      {
        "lineNumber": 1,
        "ruleNames": [ "name" ],
        "ruleDescription": "description",
        "ruleInformation": null,
        "errorDetail": `This rule threw an exception: ${errorMessage}`,
        "errorContext": null,
        "errorRange": null,
        "fixInfo": null
      }
    ]
  };
  for (const inputs of stringScenarios) {
    const [ subname, files, strings ] = inputs;

    test(`${name}${subname}UnhandledAsync`, (t) => new Promise((resolve) => {
      t.plan(4);
      lintAsync({
        // @ts-ignore
        "customRules": customRule,
        // @ts-ignore
        files,
        // @ts-ignore
        strings
      }, function callback(err, result) {
        t.truthy(err, "Did not get an error for exception.");
        t.true(err instanceof Error, "Error not instance of Error.");
        // @ts-ignore
        t.is(err.message, errorMessage, "Incorrect message for exception.");
        t.true(!result, "Got result for exception.");
        resolve();
      });
    }));

    test(`${name}${subname}HandledAsync`, (t) => new Promise((resolve) => {
      t.plan(2);
      lintAsync({
        // @ts-ignore
        "customRules": customRule,
        // @ts-ignore
        files,
        // @ts-ignore
        strings,
        "handleRuleFailures": true
      }, function callback(err, actualResult) {
        t.falsy(err);
        t.deepEqual(actualResult, expectedResult, "Undetected issues.");
        resolve();
      });
    }));

    test(`${name}${subname}UnhandledSync`, (t) => {
      t.plan(1);
      t.throws(
        () => lintSync({
          // @ts-ignore
          "customRules": customRule,
          // @ts-ignore
          files,
          // @ts-ignore
          strings
        }),
        {
          "message": errorMessage
        },
        "Unexpected exception."
      );
    });

    test(`${name}${subname}HandledSync`, (t) => {
      t.plan(1);
      const actualResult = lintSync({
        // @ts-ignore
        "customRules": customRule,
        // @ts-ignore
        files,
        // @ts-ignore
        strings,
        "handleRuleFailures": true
      });
      t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    });
  }
}

for (const flavor of [
  [
    "customRulesAsyncExceptionString",
    () => {
      throw errorMessage;
    }
  ],
  [
    "customRulesAsyncExceptionError",
    () => {
      throw new Error(errorMessage);
    }
  ],
  [
    "customRulesAsyncDeferredString",
    () => fs.readFile(__filename(import.meta), "utf8").then(
      () => {
        throw errorMessage;
      }
    )
  ],
  [
    "customRulesAsyncDeferredError",
    () => fs.readFile(__filename(import.meta), "utf8").then(
      () => {
        throw new Error(errorMessage);
      }
    )
  ],
  [
    "customRulesAsyncRejectString",
    () => Promise.reject(errorMessage)
  ],
  [
    "customRulesAsyncRejectError",
    () => Promise.reject(new Error(errorMessage))
  ]
]) {
  const [ name, func ] = flavor;
  /** @type {import("markdownlint").Rule} */
  const customRule = {
    "names": [ "name" ],
    "description": "description",
    "tags": [ "tag" ],
    "parser": "none",
    "asynchronous": true,
    // @ts-ignore
    "function": func
  };
  for (const inputs of stringScenarios) {
    const [ subname, files, strings ] = inputs;

    test(`${name}${subname}Unhandled`, (t) => new Promise((resolve) => {
      t.plan(4);
      lintAsync({
        // @ts-ignore
        "customRules": [ customRule ],
        // @ts-ignore
        files,
        // @ts-ignore
        strings
      }, function callback(err, result) {
        t.truthy(err, "Did not get an error for rejection.");
        t.true(err instanceof Error, "Error not instance of Error.");
        // @ts-ignore
        t.is(err.message, errorMessage, "Incorrect message for rejection.");
        t.true(!result, "Got result for rejection.");
        resolve();
      });
    }));

    test(`${name}${subname}Handled`, (t) => new Promise((resolve) => {
      t.plan(2);
      lintAsync({
        // @ts-ignore
        "customRules": [ customRule ],
        // @ts-ignore
        files,
        // @ts-ignore
        strings,
        "handleRuleFailures": true
      }, function callback(err, actualResult) {
        t.falsy(err);
        const expectedResult = {
          "./test/custom-rules.md": [
            {
              "lineNumber": 1,
              "ruleNames": [ "name" ],
              "ruleDescription": "description",
              "ruleInformation": null,
              "errorDetail": `This rule threw an exception: ${errorMessage}`,
              "errorContext": null,
              "errorRange": null,
              "fixInfo": null
            }
          ]
        };
        t.deepEqual(actualResult, expectedResult, "Undetected issues.");
        resolve();
      });
    }));
  }
}

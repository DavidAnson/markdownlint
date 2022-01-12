// @ts-check

"use strict";

const fs = require("fs").promises;
const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");
const customRules = require("./rules/rules.js");
const { homepage, version } = require("../package.json");

test.cb("customRulesV0", (t) => {
  t.plan(4);
  const customRulesMd = "./test/custom-rules.md";
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = {
      "any-blockquote": [ 12 ],
      "every-n-lines": [ 2, 4, 6, 10, 12 ],
      "first-line": [ 1 ],
      "letters-E-X": [ 3, 7 ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
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
    t.is(actualMessage, expectedMessage, "Incorrect message (name).");
    // @ts-ignore
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
    t.is(actualMessage, expectedMessage, "Incorrect message (alias).");
    t.end();
  });
});

test.cb("customRulesV1", (t) => {
  t.plan(3);
  const customRulesMd = "./test/custom-rules.md";
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 1
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = [
      { "lineNumber": 12,
        "ruleName": "any-blockquote",
        "ruleAlias": "any-blockquote",
        "ruleDescription": "Rule that reports an error for any blockquote",
        "ruleInformation":
          `${homepage}/blob/main/test/rules/any-blockquote.js`,
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
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    t.end();
  });
});

test.cb("customRulesV2", (t) => {
  t.plan(3);
  const customRulesMd = "./test/custom-rules.md";
  const options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 2
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = [
      { "lineNumber": 12,
        "ruleNames": [ "any-blockquote" ],
        "ruleDescription": "Rule that reports an error for any blockquote",
        "ruleInformation":
          `${homepage}/blob/main/test/rules/any-blockquote.js`,
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
    t.is(actualMessage, expectedMessage, "Incorrect message.");
    t.end();
  });
});

test.cb("customRulesConfig", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {};
    expectedResult[customRulesMd] = {
      "any-blockquote": [ 12 ],
      "every-n-lines": [ 3, 6, 12 ],
      "first-line": [ 1 ],
      "letters-E-X": [ 7 ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("customRulesNpmPackage", (t) => {
  t.plan(2);
  const options = {
    "customRules": [ require("./rules/npm") ],
    "strings": {
      "string": "# Text\n\n---\n\nText\n"
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {};
    expectedResult.string = {
      "sample-rule": [ 3 ]
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test("customRulesBadProperty", (t) => {
  t.plan(27);
  [
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
      "propertyName": "function",
      "propertyValues": [ null, "string", [] ]
    }
  ].forEach(function forTestCase(testCase) {
    const { propertyName, propertyValues } = testCase;
    propertyValues.forEach(function forPropertyValue(propertyValue) {
      const badRule = { ...customRules.anyBlockquote };
      badRule[propertyName] = propertyValue;
      const options = {
        "customRules": [ badRule ]
      };
      t.throws(
        function badRuleCall() {
          markdownlint.sync(options);
        },
        {
          "message":
            `Property '${propertyName}' of custom rule at index 0 is incorrect.`
        },
        "Did not get correct exception for missing property."
      );
    });
  });
});

test.cb("customRulesUsedNameName", (t) => {
  t.plan(4);
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
    t.truthy(err, "Did not get an error for duplicate name.");
    t.true(err instanceof Error, "Error not instance of Error.");
    t.is(err.message,
      "Name 'NO-missing-SPACE-atx' of custom rule at index 0 is " +
        "already used as a name or tag.",
      "Incorrect message for duplicate name.");
    t.true(!result, "Got result for duplicate name.");
    t.end();
  });
});

test.cb("customRulesUsedNameTag", (t) => {
  t.plan(4);
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
    t.truthy(err, "Did not get an error for duplicate name.");
    t.true(err instanceof Error, "Error not instance of Error.");
    t.is(err.message,
      "Name 'HtMl' of custom rule at index 0 is already used as a name or tag.",
      "Incorrect message for duplicate name.");
    t.true(!result, "Got result for duplicate name.");
    t.end();
  });
});

test.cb("customRulesUsedTagName", (t) => {
  t.plan(4);
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
    t.truthy(err, "Did not get an error for duplicate tag.");
    t.true(err instanceof Error, "Error not instance of Error.");
    t.is(err.message,
      "Tag 'NO-missing-SPACE-atx' of custom rule at index 1 is " +
        "already used as a name.",
      "Incorrect message for duplicate name.");
    t.true(!result, "Got result for duplicate tag.");
    t.end();
  });
});

test.cb("customRulesThrowForFile", (t) => {
  t.plan(4);
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
    t.truthy(err, "Did not get an error for function thrown.");
    t.true(err instanceof Error, "Error not instance of Error.");
    t.is(err.message, exceptionMessage,
      "Incorrect message for function thrown.");
    t.true(!result, "Got result for function thrown.");
    t.end();
  });
});

test("customRulesThrowForFileSync", (t) => {
  t.plan(1);
  const exceptionMessage = "Test exception message";
  t.throws(
    function customRuleThrowsCall() {
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
    },
    {
      "message": exceptionMessage
    },
    "Did not get correct exception for function thrown."
  );
});

test.cb("customRulesThrowForString", (t) => {
  t.plan(4);
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
    t.truthy(err, "Did not get an error for function thrown.");
    t.true(err instanceof Error, "Error not instance of Error.");
    t.is(err.message, exceptionMessage,
      "Incorrect message for function thrown.");
    t.true(!result, "Got result for function thrown.");
    t.end();
  });
});

test("customRulesThrowForStringSync", (t) => {
  t.plan(1);
  const exceptionMessage = "Test exception message";
  t.throws(
    function customRuleThrowsCall() {
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

test.cb("customRulesOnErrorNull", (t) => {
  t.plan(4);
  markdownlint({
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
  },
  function callback(err, result) {
    t.truthy(err, "Did not get an error for function thrown.");
    t.true(err instanceof Error, "Error not instance of Error.");
    t.is(
      err.message,
      "Property 'lineNumber' of onError parameter is incorrect.",
      "Did not get correct exception for null object."
    );
    t.true(!result, "Got result for function thrown.");
    t.end();
  });
});

test("customRulesOnErrorNullSync", (t) => {
  t.plan(1);
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
  t.throws(
    function nullErrorCall() {
      markdownlint.sync(options);
    },
    {
      "message": "Property 'lineNumber' of onError parameter is incorrect."
    },
    "Did not get correct exception for null object."
  );
});

test("customRulesOnErrorBad", (t) => {
  t.plan(21);
  [
    {
      "propertyName": "lineNumber",
      "subPropertyName": null,
      "propertyValues": [ null, "string" ]
    },
    {
      "propertyName": "detail",
      "subPropertyName": null,
      "propertyValues": [ 10, [] ]
    },
    {
      "propertyName": "context",
      "subPropertyName": null,
      "propertyValues": [ 10, [] ]
    },
    {
      "propertyName": "range",
      "subPropertyName": null,
      "propertyValues": [ 10, [], [ 10 ], [ 10, null ], [ 10, 11, 12 ] ]
    },
    {
      "propertyName": "fixInfo",
      "subPropertyName": null,
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
  ].forEach(function forTestCase(testCase) {
    const { propertyName, subPropertyName, propertyValues } = testCase;
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
      t.throws(
        function badErrorCall() {
          markdownlint.sync(options);
        },
        {
          "message":
            `Property '${propertyNames}' of onError parameter is incorrect.`
        },
        "Did not get correct exception for bad object."
      );
    });
  });
});

test("customRulesOnErrorInvalid", (t) => {
  t.plan(17);
  [
    {
      "propertyName": "lineNumber",
      "subPropertyName": null,
      "propertyValues": [ -1, 0, 3, 4 ]
    },
    {
      "propertyName": "range",
      "subPropertyName": null,
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
  ].forEach(function forTestCase(testCase) {
    const { propertyName, subPropertyName, propertyValues } = testCase;
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
      t.throws(
        function invalidErrorCall() {
          markdownlint.sync(options);
        },
        {
          "message":
            `Property '${propertyNames}' of onError parameter is incorrect.`
        },
        "Did not get correct exception for invalid object."
      );
    });
  });
});

test("customRulesOnErrorValid", (t) => {
  t.plan(24);
  [
    {
      "propertyName": "lineNumber",
      "subPropertyName": null,
      "propertyValues": [ 1, 2 ]
    },
    {
      "propertyName": "range",
      "subPropertyName": null,
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
  ].forEach(function forTestCase(testCase) {
    const { propertyName, subPropertyName, propertyValues } = testCase;
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
      t.truthy(true);
    });
  });
});

test.cb("customRulesOnErrorLazy", (t) => {
  t.plan(2);
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
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
  markdownlint(options, function callback(err, actualResult) {
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
          "errorRange": [ 1, 1 ]
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("customRulesOnErrorModified", (t) => {
  t.plan(2);
  const errorObject = {
    "lineNumber": 1,
    "detail": "detail",
    "context": "context",
    "range": [ 1, 2 ],
    "fixInfo": {
      "editColumn": 1,
      "deleteCount": 2,
      "insertText": "text"
    }
  };
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function onErrorModified(params, onError) {
          onError(errorObject);
          errorObject.lineNumber = 2;
          errorObject.detail = "changed";
          errorObject.context = "changed";
          errorObject.range[1] = 3;
          errorObject.fixInfo.editColumn = 2;
          errorObject.fixInfo.deleteCount = 3;
          errorObject.fixInfo.insertText = "changed";
        }
      }
    ],
    "strings": {
      "string": "# Heading\n"
    },
    "resultVersion": 3
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "string": [
        {
          "lineNumber": 1,
          "ruleNames": [ "name" ],
          "ruleDescription": "description",
          "ruleInformation": null,
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
    t.end();
  });
});

test.cb("customRulesOnErrorInvalidHandled", (t) => {
  t.plan(2);
  markdownlint({
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
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
            "Property 'lineNumber' of onError parameter is incorrect.",
          "errorContext": null,
          "errorRange": null
        }
      ]
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test("customRulesOnErrorInvalidHandledSync", (t) => {
  t.plan(1);
  const actualResult = markdownlint.sync({
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
  });
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
  t.deepEqual(actualResult, expectedResult, "Undetected issues.");
});

test.cb("customRulesFileName", (t) => {
  t.plan(2);
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function stringName(params) {
          t.is(params.name, "doc/CustomRules.md", "Incorrect file name");
        }
      }
    ],
    "files": "doc/CustomRules.md"
  };
  markdownlint(options, function callback(err) {
    t.falsy(err);
    t.end();
  });
});

test.cb("customRulesStringName", (t) => {
  t.plan(2);
  const options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function stringName(params) {
          t.is(params.name, "string", "Incorrect string name");
        }
      }
    ],
    "strings": {
      "string": "# Heading"
    }
  };
  markdownlint(options, function callback(err) {
    t.falsy(err);
    t.end();
  });
});

test.cb("customRulesDoc", (t) => {
  t.plan(2);
  markdownlint({
    "files": "./doc/CustomRules.md",
    "config": {
      "MD013": { "line_length": 200 }
    }
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = { "./doc/CustomRules.md": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test.cb("customRulesLintJavaScript", (t) => {
  t.plan(2);
  const options = {
    "customRules": customRules.lintJavaScript,
    "files": "test/lint-javascript.md"
  };
  markdownlint(options, (err, actual) => {
    t.falsy(err);
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
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test.cb("customRulesValidateJson", (t) => {
  t.plan(2);
  const options = {
    "customRules": customRules.validateJson,
    "files": "test/validate-json.md"
  };
  markdownlint(options, (err, actual) => {
    t.falsy(err);
    const expected = {
      "test/validate-json.md": [
        {
          "lineNumber": 22,
          "ruleNames": [ "validate-json" ],
          "ruleDescription": "Rule that validates JSON code",
          "ruleInformation": null,
          "errorDetail": "Unexpected end of JSON input",
          "errorContext": null,
          "errorRange": null
        }
      ]
    };
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test("customRulesAsyncThrowsInSyncContext", (t) => {
  t.plan(1);
  const options = {
    "customRules": [
      {
        "names": [ "name1", "name2" ],
        "description": "description",
        "tags": [ "tag" ],
        "asynchronous": true,
        "function": () => {}
      }
    ],
    "strings": {
      "string": "Unused"
    }
  };
  t.throws(
    () => markdownlint.sync(options),
    {
      "message": "Custom rule name1/name2 at index 0 is asynchronous and " +
        "can not be used in a synchronous context."
    },
    "Did not get correct exception for async rule in sync context."
  );
});

test("customRulesAsyncReadFiles", (t) => {
  t.plan(3);
  const options = {
    "customRules": [
      {
        "names": [ "name1" ],
        "description": "description1",
        "information": new URL("https://example.com/asyncRule1"),
        "tags": [ "tag" ],
        "asynchronous": true,
        "function":
          (params, onError) => fs.readFile(__filename, "utf8").then(
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
        "function":
          async(params, onError) => {
            const content = await fs.readFile(__filename, "utf8");
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
        "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md047`,
        "errorDetail": null,
        "errorContext": null,
        "errorRange": [ 9, 1 ]
      },
      {
        "lineNumber": 1,
        "ruleNames": [ "name1" ],
        "ruleDescription": "description1",
        "ruleInformation": "https://example.com/asyncRule1",
        "errorDetail": "detail1",
        "errorContext": "context1",
        "errorRange": [ 2, 3 ]
      },
      {
        "lineNumber": 1,
        "ruleNames": [ "name2" ],
        "ruleDescription": "description2",
        "ruleInformation": null,
        "errorDetail": "detail2",
        "errorContext": "context2",
        "errorRange": null
      }
    ]
  };
  return markdownlint.promises.markdownlint(options)
    .then((actual) => t.deepEqual(actual, expected, "Unexpected issues."));
});

test("customRulesAsyncIgnoresSyncReturn", (t) => {
  t.plan(1);
  const options = {
    "customRules": [
      {
        "names": [ "sync" ],
        "description": "description",
        "information": new URL("https://example.com/asyncRule"),
        "tags": [ "tag" ],
        "asynchronous": false,
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
        "function": (params, onError) => new Promise((resolve) => {
          onError({ "lineNumber": 1 });
          resolve();
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
        "errorRange": null
      },
      {
        "lineNumber": 1,
        "ruleNames": [ "MD047", "single-trailing-newline" ],
        "ruleDescription": "Files should end with a single newline character",
        "ruleInformation": `${homepage}/blob/v${version}/doc/Rules.md#md047`,
        "errorDetail": null,
        "errorContext": null,
        "errorRange": [ 9, 1 ]
      }
    ]
  };
  return markdownlint.promises.markdownlint(options)
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

[
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
].forEach((flavor) => {
  const [ name, func ] = flavor;
  const customRule = [
    {
      "names": [ "name" ],
      "description": "description",
      "tags": [ "tag" ],
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
        "errorRange": null
      }
    ]
  };
  stringScenarios.forEach((inputs) => {
    const [ subname, files, strings ] = inputs;

    test.cb(`${name}${subname}UnhandledAsync`, (t) => {
      t.plan(4);
      markdownlint({
        // @ts-ignore
        "customRules": customRule,
        // @ts-ignore
        files,
        // @ts-ignore
        strings
      }, function callback(err, result) {
        t.truthy(err, "Did not get an error for exception.");
        t.true(err instanceof Error, "Error not instance of Error.");
        t.is(err.message, errorMessage, "Incorrect message for exception.");
        t.true(!result, "Got result for exception.");
        t.end();
      });
    });

    test.cb(`${name}${subname}HandledAsync`, (t) => {
      t.plan(2);
      markdownlint({
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
        t.end();
      });
    });

    test(`${name}${subname}UnhandledSync`, (t) => {
      t.plan(1);
      t.throws(
        () => markdownlint.sync({
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
      const actualResult = markdownlint.sync({
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
  });
});

[
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
    () => fs.readFile(__filename, "utf8").then(
      () => {
        throw errorMessage;
      }
    )
  ],
  [
    "customRulesAsyncDeferredError",
    () => fs.readFile(__filename, "utf8").then(
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
].forEach((flavor) => {
  const [ name, func ] = flavor;
  const customRule = {
    "names": [ "name" ],
    "description": "description",
    "tags": [ "tag" ],
    "asynchronous": true,
    "function": func
  };
  stringScenarios.forEach((inputs) => {
    const [ subname, files, strings ] = inputs;

    test.cb(`${name}${subname}Unhandled`, (t) => {
      t.plan(4);
      markdownlint({
        // @ts-ignore
        "customRules": [ customRule ],
        // @ts-ignore
        files,
        // @ts-ignore
        strings
      }, function callback(err, result) {
        t.truthy(err, "Did not get an error for rejection.");
        t.true(err instanceof Error, "Error not instance of Error.");
        t.is(err.message, errorMessage, "Incorrect message for rejection.");
        t.true(!result, "Got result for rejection.");
        t.end();
      });
    });

    test.cb(`${name}${subname}Handled`, (t) => {
      t.plan(2);
      markdownlint({
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
              "errorRange": null
            }
          ]
        };
        t.deepEqual(actualResult, expectedResult, "Undetected issues.");
        t.end();
      });
    });
  });
});

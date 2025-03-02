// @ts-check

import test from "ava";
import parseConfiguration from "../lib/parse-configuration.mjs";

const testObject = {
  "string": "text",
  "number": 10,
  "object": {
    "property": "value"
  },
  "array": [ 1, 2, 3 ]
};
const successfulTestObjectResult = {
  "config": testObject,
  "message": null
};
const successfulParser = () => testObject;
const failingParser = () => {
  throw new Error("failingParser");
};

test("json object, default parser", (t) => {
  t.plan(1);
  const actual = parseConfiguration("name", JSON.stringify(testObject));
  t.deepEqual(actual, successfulTestObjectResult);
});

test("invalid json, default parser", (t) => {
  t.plan(1);
  const actual = parseConfiguration("name", "{");
  const expected = {
    "config": null,
    "message": "Unable to parse 'name'; Parser 0: ..."
  };
  // Backwards-compatibility for testing Node versions < 22
  if (actual.message) {
    actual.message = actual.message.replace(/Parser 0: .*$/, "Parser 0: ...");
  }
  t.deepEqual(actual, expected);
});

test("parser gets passed content", (t) => {
  t.plan(2);
  const content = "content";
  const parser = (text) => {
    t.is(text, content);
    return {};
  };
  const actual = parseConfiguration("name", content, [ parser ]);
  const expected = {
    "config": {},
    "message": null
  };
  t.deepEqual(actual, expected);
});

test("parser returns undefined/null/number/string/array", (t) => {
  t.plan(5);
  const expected = {
    "config": {},
    "message": null
  };
  const testCases = [ undefined, null, 10, "string", [] ];
  for (const testCase of testCases) {
    /** @type {import("../lib/markdownlint.mjs").ConfigurationParser} */
    const parser =
      // @ts-ignore
      () => testCase;
    const actual = parseConfiguration("name", "content", [ parser ]);
    t.deepEqual(actual, expected);
  }
});

test("custom parsers, successful/failing", (t) => {
  t.plan(1);
  const actual = parseConfiguration("name", "", [ successfulParser, failingParser ]);
  t.deepEqual(actual, successfulTestObjectResult);
});

test("custom parsers, failing/successful", (t) => {
  t.plan(1);
  const actual = parseConfiguration("name", "", [ failingParser, successfulParser ]);
  t.deepEqual(actual, successfulTestObjectResult);
});

test("custom parsers, failing/successful(undefined)", (t) => {
  t.plan(1);
  const actual = parseConfiguration(
    "name",
    "",
    // @ts-ignore
    [ failingParser, () => undefined ]
  );
  const expected = {
    "config": {},
    "message": null
  };
  t.deepEqual(actual, expected);
});

test("custom parsers, failing/failing", (t) => {
  t.plan(1);
  const actual = parseConfiguration("name", "", [ failingParser, failingParser ]);
  const expected = {
    "config": null,
    "message": "Unable to parse 'name'; Parser 0: failingParser; Parser 1: failingParser"
  };
  t.deepEqual(actual, expected);
});

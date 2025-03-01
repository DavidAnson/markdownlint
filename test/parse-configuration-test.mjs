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
  "message": ""
};
const testObjectJsonString = JSON.stringify(testObject);

test("json object, default parsers", (t) => {
  t.plan(1);
  const actual = parseConfiguration("name", testObjectJsonString);
  t.deepEqual(actual, successfulTestObjectResult);
});

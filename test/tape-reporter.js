// @ts-check

"use strict";

const tape = require("tape");
const { EOL } = require("os");
const { inspect } = require("util");
const { stdout, stderr } = process;
const inspectOptions = {
  "compact": true,
  "breakLength": Infinity
};

let tests = 0;
let assertions = 0;
let failures = 0;

tape
  .createStream({ "objectMode": true })
  .on("data", (data) => {
    if (data.type === "test") {
      tests++;
      stdout.write(`${data.name}${EOL}`);
    } else if (data.id !== undefined) {
      assertions++;
      if (!data.ok) {
        failures++;
        stderr.write([
          `  ${data.file}`,
          `  Message:  ${data.name}`,
          `  Operator: ${data.operator}`,
          `  Expected: ${inspect(data.expected, inspectOptions)}`,
          `  Actual:   ${inspect(data.actual, inspectOptions)}`,
          ""
        ].join(EOL));
      }
    }
  })
  .on("close", () => {
    stdout.write([
      "",
      `Tests:    ${tests}`,
      `Asserts:  ${assertions}`,
      `Failures: ${failures}`,
      ""
    ].join(EOL));
  });

// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");

// Simulates typing each test file to validate handling of partial input
const files = fs.readdirSync("./test");
files.filter((file) => /\.md$/.test(file)).forEach((file) => {
  const strings = {};
  let content = fs.readFileSync(path.join("./test", file), "utf8");
  while (content) {
    strings[content.length.toString()] = content;
    content = content.slice(0, -1);
  }
  test(`type ${file}`, (t) => {
    t.plan(1);
    markdownlint.sync({
      // @ts-ignore
      strings,
      "resultVersion": 0
    });
    t.pass();
  });
});

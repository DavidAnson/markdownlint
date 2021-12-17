// @ts-check

"use strict";

const globby = require("globby");
const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");

// Parses all Markdown files in all package dependencies
test.cb("parseAllFiles", (t) => {
  t.plan(1);
  const options = {
    "files": globby.sync("**/*.{md,markdown}")
  };
  markdownlint(options, (err) => {
    t.falsy(err);
    t.end();
  });
});

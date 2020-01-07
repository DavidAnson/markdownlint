// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const markdownlint = require("../lib/markdownlint");
const { utf8Encoding } = require("../helpers");

// Simulates typing each test file to validate handling of partial input
const files = fs.readdirSync("./test");
files.filter((file) => /\.md$/.test(file)).forEach((file) => {
  const strings = {};
  let content = fs.readFileSync(path.join("./test", file), utf8Encoding);
  while (content) {
    strings[content.length.toString()] = content;
    content = content.slice(0, -1);
  }
  module.exports[`type ${file}`] = (test) => {
    markdownlint.sync({
      // @ts-ignore
      strings,
      "resultVersion": 0
    });
    test.done();
  };
});

// Parses all Markdown files in all package dependencies
module.exports.parseAllFiles = (test) => {
  const globOptions = {
    // "cwd": "/",
    "realpath": true
  };
  glob("**/*.{md,markdown}", globOptions, (err, matches) => {
    test.ifError(err);
    const markdownlintOptions = {
      "files": matches
    };
    markdownlint(markdownlintOptions, (errr) => {
      test.ifError(errr);
      test.done();
    });
  });
};

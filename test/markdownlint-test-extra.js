// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const markdownlint = require("../lib/markdownlint");
const { newLineRe, utf8Encoding } = require("../helpers");

module.exports.typeTestFiles = function typeTestFiles(test) {
  // Simulates typing each test file to validate handling of partial input
  function validate(file, content) {
    const results = markdownlint.sync({
      "strings": {
        "content": content
      },
      "resultVersion": 0
    });
    const contentLineCount = content.split(newLineRe).length;
    Object.keys(results.content).forEach(function forKey(ruleName) {
      results.content[ruleName].forEach(function forLine(line) {
        test.ok((line >= 1) && (line <= contentLineCount),
          "Line number out of range: " + line +
            " (" + file + ", " + content.length + ", " + ruleName + ")");
      });
    });
  }
  const files = fs.readdirSync("./test");
  files.forEach(function forFile(file) {
    if (/\.md$/.test(file)) {
      let content = fs.readFileSync(
        path.join("./test", file), utf8Encoding);
      while (content) {
        validate(file, content);
        content = content.slice(0, -1);
      }
    }
  });
  test.done();
};

module.exports.parseAllFiles = function parseAllFiles(test) {
  // Parses all Markdown files in all dependencies
  const globOptions = {
    // "cwd": "/",
    "realpath": true
  };
  glob("**/*.{md,markdown}", globOptions, function globCallback(err, matches) {
    test.ifError(err);
    const markdownlintOptions = {
      "files": matches
    };
    markdownlint(markdownlintOptions, function markdownlintCallback(errr) {
      test.ifError(errr);
      test.done();
    });
  });
};

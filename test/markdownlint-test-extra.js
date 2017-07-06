"use strict";

var fs = require("fs");
var path = require("path");
var glob = require("glob");
var markdownlint = require("../lib/markdownlint");
var shared = require("../lib/shared");

module.exports.typeTestFiles = function typeTestFiles(test) {
  // Simulates typing each test file to validate handling of partial input
  function validate(file, content) {
    var results = markdownlint.sync({
      "strings": {
        "content": content
      },
      "resultVersion": 0
    });
    var contentLineCount = content.split(shared.newLineRe).length;
    Object.keys(results.content).forEach(function forKey(ruleName) {
      results.content[ruleName].forEach(function forLine(line) {
        test.ok((line >= 1) && (line <= contentLineCount),
          "Line number out of range: " + line +
            " (" + file + ", " + content.length + ", " + ruleName + ")");
      });
    });
  }
  var files = fs.readdirSync("./test");
  files.forEach(function forFile(file) {
    if (/\.md$/.test(file)) {
      var content = fs.readFileSync(
        path.join("./test", file), shared.utf8Encoding);
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
  var globOptions = {
    // "cwd": "/",
    "realpath": true
  };
  glob("**/*.{md,markdown}", globOptions, function globCallback(err, matches) {
    test.ifError(err);
    var markdownlintOptions = {
      "files": matches
    };
    markdownlint(markdownlintOptions, function markdownlintCallback(errr) {
      test.ifError(errr);
      test.done();
    });
  });
};

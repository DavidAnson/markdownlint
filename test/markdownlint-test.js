"use strict";

var fs = require("fs");
var path = require("path");
var markdownlint = require("../lib/markdownlint");

function createTestForFile(file) {
  return function testForFile(test) {
    test.expect(3);
    fs.readFile(
      file,
      { "encoding": "utf8" },
      function readFileCallback(err, contents) {
        test.ifError(err);
        var lines = contents.split(/\r\n|\n/g);
        var results = {};
        lines.forEach(function forLine(line, lineNum) {
          var match = line.match(/\{(MD\d+)(?::(\d+))?\}/);
          if (match) {
            var rule = match[1];
            var errors = results[rule] || [];
            errors.push(lineNum + 1);
            results[rule] = errors;
          }
        });
        markdownlint({
          "files": [ file ]
        }, function markdownlintCallback(errr, actual) {
          test.ifError(errr);
          var expected = {};
          expected[file] = results;
          test.deepEqual(actual, expected, "Line numbers are not correct.");
          test.done();
        });
      });
  };
}

/* eslint-disable no-sync, for synchronous test method creation */
fs.readdirSync(__dirname).forEach(function forFile(file) {
/* eslint-enable no-sync */
  if (file.match(/\.md$/)) {
    module.exports[file] = createTestForFile(path.join(__dirname, file));
  }
});

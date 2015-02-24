"use strict";

var fs = require("fs");
var path = require("path");
var markdownlint = require("../lib/markdownlint");

function createTestForFile(file) {
  return function(test) {
    test.expect(1);
    var contents = fs.readFileSync(file, { encoding: "utf8" });
    var lines = contents.split(/\r\n|\n/g);
    var results = {};
    lines.forEach(function(line, lineNum) {
      var match = line.match(/\{(MD\d+)(?::(\d+))?\}/);
      if (match) {
        var rule = match[1];
        var lines = results[rule] || [];
        lines.push(lineNum + 1);
        results[rule] = lines;
      }
    });
    var actual = markdownlint({
      files: [ file ]
    });
    var expected = {};
    expected[file] = results;
    test.deepEqual(actual, expected, "Line numbers are not correct.");
    test.done();
  };
}

fs.readdirSync(__dirname).forEach(function(file) {
  if (file.match(/\.md$/)) {
    module.exports[file] = createTestForFile(path.join(__dirname, file));
  }
});

"use strict";

var fs = require("fs");
var path = require("path");
var markdownlint = require("../lib/markdownlint");

var encodingUtf8 = { "encoding": "utf8" };

function createTestForFile(file) {
  return function testForFile(test) {
    test.expect(4);
    fs.readFile(file, encodingUtf8, function readFileCallback(err, contents) {
        test.ifError(err);
        var lines = contents.split(/\r\n|\r|\n/g);
        function lintFile(config) {
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
            "files": [ file ],
            "config": config
          }, function markdownlintCallback(errr, actual) {
            test.ifError(errr);
            var expected = {};
            expected[file] = results;
            test.deepEqual(actual, expected, "Line numbers are not correct.");
            test.done();
          });
        }
        var configFile = file.replace(/\.md$/, ".json");
        fs.stat(configFile, function statCallback(errr /*, stats*/) {
          if (errr) {
            test.ok(true, "Replacement for ifError of readFile");
            lintFile();
          } else {
            fs.readFile(configFile, encodingUtf8,
              function readFile(errrr, configContents) {
                test.ifError(errrr);
                var config = JSON.parse(configContents);
                lintFile(config);
              });
          }
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

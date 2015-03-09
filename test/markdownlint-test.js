"use strict";

var fs = require("fs");
var path = require("path");
var markdownlint = require("../lib/markdownlint");
var shared = require("../lib/shared");
var Q = require("q");

function createTestForFile(file) {
  return function testForFile(test) {
    test.expect(1);
    var configFile = file.replace(/\.md$/, ".json");
    var actualPromise = Q.nfcall(fs.stat, configFile)
      .then(
        function configFileExists() {
          return Q.nfcall(fs.readFile, configFile, { "encoding": "utf8" })
            .then(
              function configFileContents(contents) {
                return JSON.parse(contents);
              });
        },
        function noConfigFile() {
          return null;
        })
      .then(
        function lintWithConfig(config) {
          return Q.nfcall(markdownlint, {
            "files": [ file ],
            "config": config
          });
        });
    var expectedPromise = Q.nfcall(fs.readFile, file, { "encoding": "utf8" })
      .then(
        function fileContents(contents) {
          var lines = contents.split(shared.newLineRe);
          var results = {};
          lines.forEach(function forLine(line, lineNum) {
            var regex = /\{(MD\d+)(?::(\d+))?\}/g;
            var match;
            while ((match = regex.exec(line))) {
              var rule = match[1];
              var errors = results[rule] || [];
              errors.push(match[2] ? parseInt(match[2], 10) : lineNum + 1);
              results[rule] = errors;
            }
          });
          return results;
        });
    Q.all([ actualPromise, expectedPromise ])
      .then(
        function compareResults(fulfillments) {
          var actual = fulfillments[0];
          var results = fulfillments[1];
          var expected = {};
          expected[file] = results;
          test.deepEqual(actual, expected, "Line numbers are not correct.");
        })
      .done(test.done, test.done);
  };
}

/* eslint-disable no-sync, for synchronous test method creation */
fs.readdirSync(__dirname).forEach(function forFile(file) {
/* eslint-enable no-sync */
  if (file.match(/\.md$/)) {
    module.exports[file] = createTestForFile(path.join(__dirname, file));
  }
});

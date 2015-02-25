"use strict";

var fs = require("fs");
var rules = require("./rules");

function numberComparison(a, b) {
  return a - b;
}

function uniqueFilterForSorted(value, index, array) {
  return (index === 0) || (value > array[index - 1]);
}

function lintFile(file, options, callback) {
  fs.readFile(file, { "encoding": "utf8" }, function readFile(err, contents) {
    if (err) {
      callback(err);
    } else {
      var lines = contents.split(/\r\n|\n/g);
      var result = {};
      Object.keys(rules).forEach(function forRule(name) {
        var rule = rules[name];
        var errors = rule(lines);
        if (errors.length) {
          errors.sort(numberComparison);
          result[name] = errors.filter(uniqueFilterForSorted);
        }
      });
      callback(null, result);
    }
  });
}

module.exports = function markdownlint(options, callback) {
  var results = {};
  var files = options.files || [];
  function lintFiles() {
    var file = files.shift();
    if (file) {
      lintFile(file, options, function lintFileCallback(err, result) {
        if (err) {
          callback(err);
        } else {
          results[file] = result;
          lintFiles();
        }
      });
    } else {
      callback(null, results);
    }
  }
  lintFiles();
};

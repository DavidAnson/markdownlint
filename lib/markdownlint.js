"use strict";

var fs = require("fs");
var md = require("markdown-it")();
var rules = require("./rules");
var shared = require("./shared");

var ruleToDescription = {};
rules.forEach(function forRule(rule) {
  ruleToDescription[rule.name] = rule.desc;
});

function Results() { }
Results.prototype.toString = function resultsToString() {
  var self = this;
  var results = [];
  Object.keys(self).forEach(function forFile(file) {
    var fileResults = self[file];
    Object.keys(fileResults).forEach(function forRule(rule) {
      var ruleResults = fileResults[rule];
      ruleResults.forEach(function forLine(lineNumber) {
        var result =
          file + ": " + lineNumber + ": " +
          rule + " " + ruleToDescription[rule];
        results.push(result);
      });
    });
  });
  return results.join("\n");
};

function numberComparison(a, b) {
  return a - b;
}

function uniqueFilterForSorted(value, index, array) {
  return (index === 0) || (value > array[index - 1]);
}

function lintFile(file, config, callback) {
  fs.readFile(file, { "encoding": "utf8" }, function readFile(err, contents) {
    if (err) {
      callback(err);
    } else {
      var tokens = md.parse(contents, {});
      var lines = contents.split(shared.newLineRe);
      tokens.forEach(function forToken(token) {
        if (token.lines) {
          token.line = lines[token.lines[0]];
          token.lineNumber = token.lines[0] + 1;
        }
      });
      var params = {
        "tokens": tokens,
        "lines": lines
      };
      var result = {};
      var configDefault = config.default;
      var defaultRule = (configDefault !== undefined) && !!configDefault;
      rules.forEach(function forRule(rule) {
        var ruleConfig = config[rule.name];
        if (ruleConfig || (defaultRule && (ruleConfig === undefined))) {
          params.options = (ruleConfig instanceof Object) ? ruleConfig : {};
          var errors = [];
          rule.func(params, errors);
          if (errors.length) {
            errors.sort(numberComparison);
            result[rule.name] = errors.filter(uniqueFilterForSorted);
          }
        }
      });
      callback(null, result);
    }
  });
}

module.exports = function markdownlint(options, callback) {
  options = options || {};
  callback = callback || function noop() {};
  var files = (options.files || []).slice();
  var config = options.config || { "default": true };
  var results = new Results();
  function lintFiles() {
    var file = files.shift();
    if (file) {
      lintFile(file, config, function lintFileCallback(err, result) {
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

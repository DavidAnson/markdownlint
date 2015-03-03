"use strict";

var fs = require("fs");
var md = require("markdown-it")();
var rules = require("./rules");

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
      var params = {
        "tokens": md.parse(contents),
        "lines": contents.split(/\r\n|\r|\n/g)
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
  var files = options.files || [];
  var config = options.config || { "default": true };
  var results = {};
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

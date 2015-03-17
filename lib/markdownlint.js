"use strict";

var fs = require("fs");
var md = require("markdown-it")();
var rules = require("./rules");
var shared = require("./shared");

// Mappings from rule to description and tag to rules
var ruleToDescription = {};
var tagToRules = {};
rules.forEach(function forRule(rule) {
  ruleToDescription[rule.name] = rule.desc;
  // The following is useful for updating README.md
  // console.log("* **" + rule.name + "** - " + rule.desc);
  rule.tags.forEach(function forTag(tag) {
    var tags = tagToRules[tag] || [];
    tags.push(rule.name);
    tagToRules[tag] = tags;
  });
});
// The following is useful for updating README.md
// Object.keys(tagToRules).sort().forEach(function forTag(tag) {
//   console.log("* **" + tag + "** - " + tagToRules[tag].join(", "));
// });

// Class for results with toString for pretty display
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

// Array.sort comparison for number objects
function numberComparison(a, b) {
  return a - b;
}

// Function to return unique values from a sorted array
function uniqueFilterForSorted(value, index, array) {
  return (index === 0) || (value > array[index - 1]);
}

// Lints a single file
function lintFile(file, config, callback) {
  fs.readFile(file, shared.utf8Encoding, function readFile(err, contents) {
    if (err) {
      callback(err);
    } else {
      // Parse file into tokens and lines
      var tokens = md.parse(contents, {});
      var lines = contents.split(shared.newLineRe);
      // Annotate tokens with line/lineNumber
      tokens.forEach(function forToken(token) {
        if (token.lines) {
          token.line = lines[token.lines[0]];
          token.lineNumber = token.lines[0] + 1;
          // Trim bottom of token to exclude whitespace lines
          while (!(lines[token.lines[1] - 1].trim())) {
            token.lines[1]--;
          }
        }
      });
      // Create parameters for rules
      var params = {
        "tokens": tokens,
        "lines": lines
      };
      var result = {};
      var defaultRule = (config.default !== undefined) && !!config.default;
      // Run each rule
      rules.forEach(function forRule(rule) {
        var ruleConfig = config[rule.name];
        if (ruleConfig || (defaultRule && (ruleConfig === undefined))) {
          // Pass rule-specific options
          params.options = (ruleConfig instanceof Object) ? ruleConfig : {};
          var errors = [];
          rule.func(params, errors);
          // Record any errors
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

/**
 * Lint specified Markdown files according to configurable rules.
 *
 * @param {Object} options Configuration options.
 * @param {Function} callback Callback (err, results) function.
 * @returns {void}
 */
module.exports = function markdownlint(options, callback) {
  // Normalize inputs
  options = options || {};
  callback = callback || function noop() {};
  var files = (options.files || []).slice();
  var config = options.config || { "default": true };
  var results = new Results();
  // Lint each input file
  function lintFiles() {
    var file = files.shift();
    if (file) {
      lintFile(file, config, function lintFileCallback(err, result) {
        if (err) {
          callback(err);
        } else {
          // Record errors and lint next file
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

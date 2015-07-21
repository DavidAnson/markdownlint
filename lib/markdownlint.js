"use strict";

var fs = require("fs");
var md = require("markdown-it")({ "html": true });
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

// Lints a single string
function lintContent(content, config) {
  // Parse content into tokens and lines
  var tokens = md.parse(content, {});
  var lines = content.split(shared.newLineRe);
  var tokenLists = {};
  // Annotate tokens with line/lineNumber
  tokens.forEach(function forToken(token) {
    if (token.map) {
      token.line = lines[token.map[0]];
      token.lineNumber = token.map[0] + 1;
      // Trim bottom of token to exclude whitespace lines
      while (!(lines[token.map[1] - 1].trim())) {
        token.map[1]--;
      }
      // Annotate children with lineNumber
      var lineNumber = token.lineNumber;
      (token.children || []).forEach(function forChild(child) {
        child.lineNumber = lineNumber;
        if ((child.type === "softbreak") || (child.type === "hardbreak")) {
          lineNumber++;
        }
      });
    }
    if (!tokenLists[token.type]) {
      tokenLists[token.type] = [];
    }
    tokenLists[token.type].push(token);
  });
  // Create parameters for rules
  var params = {
    "tokens": tokens,
    "tokenLists": tokenLists,
    "lines": lines
  };
  // Merge rules/tags and sanitize config
  var mergedRules = {};
  var ruleDefault = (config.default === undefined) || !!config.default;
  rules.forEach(function forRule(rule) {
    mergedRules[rule.name] = ruleDefault;
  });
  Object.keys(config).forEach(function forKey(key) {
    var value = config[key];
    if (value) {
      if (!(value instanceof Object)) {
        value = {};
      }
    } else {
      value = false;
    }
    if (ruleToDescription[key]) {
      mergedRules[key] = value;
    } else if (tagToRules[key]) {
      tagToRules[key].forEach(function forRule(rule) {
        mergedRules[rule] = value;
      });
    }
  });
  // Run each enabled rule
  var result = {};
  rules.forEach(function forRule(rule) {
    if (mergedRules[rule.name]) {
      // Configure rule
      params.options = mergedRules[rule.name];
      var errors = [];
      rule.func(params, errors, config);
      // Record any errors
      if (errors.length) {
        errors.sort(numberComparison);
        result[rule.name] = errors.filter(uniqueFilterForSorted);
      }
    }
  });
  return result;
}

// Lints a single file
function lintFile(file, config, synchronous, callback) {
  function lintContentWrapper(err, content) {
    if (err) {
      return callback(err);
    }
    var result = lintContent(content, config);
    callback(null, result);
  }
  // Make a/synchronous call to read file
  if (synchronous) {
    lintContentWrapper(null, fs.readFileSync(file, shared.utf8Encoding));
  } else {
    fs.readFile(file, shared.utf8Encoding, lintContentWrapper);
  }
}

// Callback used as a sentinel by markdownlintSync
function markdownlintSynchronousCallback() {
  // Unreachable; no code path in the synchronous case passes err
  // if (err) {
  //   throw err; // Synchronous APIs throw
  // }
}

/**
 * Lint specified Markdown files according to configurable rules.
 *
 * @param {Object} options Configuration options.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function markdownlint(options, callback) {
  // Normalize inputs
  options = options || {};
  callback = callback || function noop() {};
  var files = (options.files || []).slice();
  var strings = options.strings || {};
  var config = options.config || { "default": true };
  var synchronous = (callback === markdownlintSynchronousCallback);
  var results = new Results();
  // Helper to lint the next file in the array
  function lintFilesArray() {
    var file = files.shift();
    if (file) {
      lintFile(file, config, synchronous, function lintedFile(err, result) {
        if (err) {
          return callback(err);
        }
        // Record errors and lint next file
        results[file] = result;
        lintFilesArray();
      });
    } else {
      callback(null, results);
    }
  }
  // Lint strings
  Object.keys(strings).forEach(function forKey(key) {
    var result = lintContent(strings[key] || "", config);
    results[key] = result;
  });
  // Lint files
  lintFilesArray();
  // Return results
  if (synchronous) {
    return results;
  }
}

/**
 * Lint specified Markdown files according to configurable rules.
 *
 * @param {Object} options Configuration options.
 * @returns {Object} Result object.
 */
function markdownlintSync(options) {
  return markdownlint(options, markdownlintSynchronousCallback);
}

// Export a/synchronous APIs
module.exports = markdownlint;
module.exports.sync = markdownlintSync;

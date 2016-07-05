"use strict";

var fs = require("fs");
var md = require("markdown-it")({ "html": true });
var rules = require("./rules");
var shared = require("./shared");

// Mappings from rule to description and tag to rules
var allRuleNames = [];
var ruleNameToRule = {};
var idUpperToRuleNames = {};
rules.forEach(function forRule(rule) {
  allRuleNames.push(rule.name);
  ruleNameToRule[rule.name] = rule;
  // The following is useful for updating README.md
  // console.log("* **" + rule.name + "** *" +
  //   rule.aliases.join(", ") + "* - " + rule.desc);
  rule.tags.forEach(function forTag(tag) {
    var tagUpper = tag.toUpperCase();
    var ruleNames = idUpperToRuleNames[tagUpper] || [];
    ruleNames.push(rule.name);
    idUpperToRuleNames[tagUpper] = ruleNames;
  });
  rule.aliases.forEach(function forAlias(alias) {
    var aliasUpper = alias.toUpperCase();
    idUpperToRuleNames[aliasUpper] = [ rule.name ];
  });
});
// The following is useful for updating README.md
// Object.keys(idUpperToRuleNames).sort().forEach(function forTag(tag) {
//   console.log("* **" + tag + "** - " + idUpperToRuleNames[tag].join(", "));
// });

// Class for results with toString for pretty display
function Results() {}
Results.prototype.toString = function resultsToString(useAlias) {
  var that = this;
  var results = [];
  Object.keys(that).forEach(function forFile(file) {
    var fileResults = that[file];
    Object.keys(fileResults).forEach(function forRule(ruleName) {
      var rule = ruleNameToRule[ruleName];
      var ruleResults = fileResults[ruleName];
      ruleResults.forEach(function forLine(lineNumber) {
        var result =
          file + ": " +
          lineNumber + ": " +
          (useAlias ? rule.aliases[0] : rule.name) + " " +
          rule.desc;
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
function lintContent(content, config, frontMatter) { // eslint-disable-line
  // Remove front matter (if present at beginning of content)
  var frontMatterLines = 0;
  if (frontMatter) {
    var frontMatterMatch = content.match(frontMatter);
    if (frontMatterMatch && !frontMatterMatch.index) {
      var contentMatched = frontMatterMatch[0];
      content = content.slice(contentMatched.length);
      frontMatterLines = contentMatched.split(shared.newLineRe).length - 1;
    }
  }
  // Parse content into tokens and lines
  var tokens = md.parse(content, {});
  var lines = content.split(shared.newLineRe);
  var tokenLists = {};
  var tbodyMap = null;
  // Annotate tokens with line/lineNumber
  tokens.forEach(function forToken(token) {
    // Handle missing maps for table body
    if (token.type === "tbody_open") {
      tbodyMap = token.map.slice();
    } else if ((token.type === "tr_close") && tbodyMap) {
      tbodyMap[0]++;
    } else if (token.type === "tbody_close") {
      tbodyMap = null;
    }
    if (tbodyMap && !token.map) {
      token.map = tbodyMap.slice();
    }
    // Update token metadata
    if (token.map) {
      token.line = lines[token.map[0]];
      token.lineNumber = token.map[0] + 1;
      // Trim bottom of token to exclude whitespace lines
      while (token.map[1] && !(lines[token.map[1] - 1].trim())) {
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
  // Merge rules/tags and sanitize config
  var defaultKey = Object.keys(config).filter(function forKey(key) {
    return key.toUpperCase() === "DEFAULT";
  });
  var ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
  var mergedRules = {};
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
    var keyUpper = key.toUpperCase();
    if (ruleNameToRule[keyUpper]) {
      mergedRules[keyUpper] = value;
    } else if (idUpperToRuleNames[keyUpper]) {
      idUpperToRuleNames[keyUpper].forEach(function forRule(ruleName) {
        mergedRules[ruleName] = value;
      });
    }
  });
  // Create mapping of enabled rules per line
  var enabledRules = {};
  rules.forEach(function forRule(rule) {
    enabledRules[rule.name] = !!mergedRules[rule.name];
  });
  function forMatch(match) {
    var enabled = match[1].toUpperCase() === "EN";
    var items = match[2] ?
      match[2].trim().toUpperCase().split(/\s+/) :
      allRuleNames;
    items.forEach(function forItem(nameUpper) {
      if (ruleNameToRule[nameUpper]) {
        enabledRules[nameUpper] = enabled;
      } else if (idUpperToRuleNames[nameUpper]) {
        idUpperToRuleNames[nameUpper].forEach(function forRule(ruleName) {
          enabledRules[ruleName] = enabled;
        });
      }
    });
  }
  var enabledRulesPerLineNumber = [ null ];
  lines.forEach(function forLine(line) {
    var match = shared.inlineCommentRe.exec(line);
    if (match) {
      enabledRules = shared.clone(enabledRules);
      while (match) {
        forMatch(match);
        match = shared.inlineCommentRe.exec(line);
      }
    }
    enabledRulesPerLineNumber.push(enabledRules);
  });
  // Create parameters for rules
  var params = {
    "tokens": tokens,
    "tokenLists": tokenLists,
    "lines": lines
  };
  // Run each rule
  var result = {};
  rules.forEach(function forRule(rule) {
    // Configure rule
    params.options = mergedRules[rule.name];
    var errors = [];
    rule.func(params, errors);
    // Record any errors (significant performance benefit from length check)
    if (errors.length) {
      errors.sort(numberComparison);
      var filteredErrors = errors
        .filter(uniqueFilterForSorted)
        .filter(function removeDisabledRules(lineNumber) {
          return enabledRulesPerLineNumber[lineNumber][rule.name];
        })
        .map(function adjustLineNumbers(error) {
          return error + frontMatterLines;
        });
      if (filteredErrors.length) {
        result[rule.name] = filteredErrors;
      }
    }
  });
  return result;
}

// Lints a single file
function lintFile(file, config, frontMatter, synchronous, callback) {
  function lintContentWrapper(err, content) {
    if (err) {
      return callback(err);
    }
    var result = lintContent(content, config, frontMatter);
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
  var files = [];
  if (Array.isArray(options.files)) {
    files = options.files.slice();
  } else if (options.files) {
    files = [ String(options.files) ];
  }
  var strings = options.strings || {};
  var frontMatter = (options.frontMatter === undefined) ?
                      shared.frontMatterRe : options.frontMatter;
  var config = options.config || { "default": true };
  var synchronous = (callback === markdownlintSynchronousCallback);
  var results = new Results();
  // Helper to lint the next file in the array
  function lintFilesArray() {
    var file = files.shift();
    if (file) {
      lintFile(file, config, frontMatter, synchronous,
        function lintedFile(err, result) {
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
    var result = lintContent(strings[key] || "", config, frontMatter);
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

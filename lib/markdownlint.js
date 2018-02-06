// @ts-check

"use strict";

var fs = require("fs");
var path = require("path");
var md = require("markdown-it")({ "html": true });
var rules = require("./rules");
var shared = require("./shared");

// Class for results with toString for pretty display
function Results() {}
Results.prototype.toString = function resultsToString(useAlias) {
  var that = this;
  var ruleNameToRule = null;
  var results = [];
  Object.keys(that).forEach(function forFile(file) {
    var fileResults = that[file];
    if (Array.isArray(fileResults)) {
      fileResults.forEach(function forResult(result) {
        var ruleMoniker = result.ruleNames ?
          result.ruleNames.join("/") :
          (result.ruleName + "/" + result.ruleAlias);
        results.push(
          file + ": " +
          result.lineNumber + ": " +
          ruleMoniker + " " +
          result.ruleDescription +
          (result.errorDetail ?
            " [" + result.errorDetail + "]" :
            "") +
          (result.errorContext ?
            " [Context: \"" + result.errorContext + "\"]" :
            ""));
      });
    } else {
      if (!ruleNameToRule) {
        ruleNameToRule = {};
        rules.forEach(function forRule(rule) {
          var ruleName = rule.names[0].toUpperCase();
          ruleNameToRule[ruleName] = rule;
        });
      }
      Object.keys(fileResults).forEach(function forRule(ruleName) {
        var rule = ruleNameToRule[ruleName];
        var ruleResults = fileResults[ruleName];
        ruleResults.forEach(function forLine(lineNumber) {
          var result =
            file + ": " +
            lineNumber + ": " +
            rule.names[useAlias ? 1 : 0] + " " +
            rule.description;
          results.push(result);
        });
      });
    }
  });
  return results.join("\n");
};

// Remove front matter (if present at beginning of content)
function removeFrontMatter(content, frontMatter) {
  var frontMatterLines = [];
  if (frontMatter) {
    var frontMatterMatch = content.match(frontMatter);
    if (frontMatterMatch && !frontMatterMatch.index) {
      var contentMatched = frontMatterMatch[0];
      content = content.slice(contentMatched.length);
      frontMatterLines = contentMatched.split(shared.newLineRe);
      if (frontMatterLines.length &&
          (frontMatterLines[frontMatterLines.length - 1] === "")) {
        frontMatterLines.length--;
      }
    }
  }
  return {
    "content": content,
    "frontMatterLines": frontMatterLines
  };
}

// Annotate tokens with line/lineNumber
function annotateTokens(tokens, lines) {
  var tbodyMap = null;
  var tokenLists = {};
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
        child.line = lines[lineNumber - 1];
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
  return tokenLists;
}

// Map rule names/tags to canonical rule name
function mapAliasToRuleNames(ruleList) {
  var aliasToRuleNames = {};
  // var tagToRuleNames = {};
  ruleList.forEach(function forRule(rule) {
    var ruleName = rule.names[0].toUpperCase();
    // The following is useful for updating README.md:
    // console.log(
    //   "* **[" + ruleName + "](doc/Rules.md#" + ruleName.toLowerCase() +
    //    ")** *" + rule.names.slice(1).join(", ") + "* - " + rule.description);
    rule.names.forEach(function forName(name) {
      var nameUpper = name.toUpperCase();
      aliasToRuleNames[nameUpper] = [ ruleName ];
    });
    rule.tags.forEach(function forTag(tag) {
      var tagUpper = tag.toUpperCase();
      var ruleNames = aliasToRuleNames[tagUpper] || [];
      ruleNames.push(ruleName);
      aliasToRuleNames[tagUpper] = ruleNames;
      // tagToRuleNames[tag] = ruleName;
    });
  });
  // The following is useful for updating README.md:
  // Object.keys(tagToRuleNames).sort().forEach(function forTag(tag) {
  //   console.log("* **" + tag + "** - " +
  //     aliasToRuleNames[tag.toUpperCase()].join(", "));
  // });
  return aliasToRuleNames;
}

// Merge rules/tags and sanitize config
function mergeRulesAndSanitize(config, aliasToRuleNames) {
  var defaultKey = Object.keys(config).filter(function forKey(key) {
    return key.toUpperCase() === "DEFAULT";
  });
  var ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
  var mergedRules = {};
  rules.forEach(function forRule(rule) {
    var ruleName = rule.names[0].toUpperCase();
    mergedRules[ruleName] = ruleDefault;
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
    (aliasToRuleNames[keyUpper] || []).forEach(function forRule(ruleName) {
      mergedRules[ruleName] = value;
    });
  });
  return mergedRules;
}

// Create mapping of enabled rules per line
function getEnabledRulesPerLineNumber(
  lines, frontMatterLines, noInlineConfig, mergedRules, aliasToRuleNames) {
  var enabledRules = {};
  var allRuleNames = [];
  rules.forEach(function forRule(rule) {
    var ruleName = rule.names[0].toUpperCase();
    allRuleNames.push(ruleName);
    enabledRules[ruleName] = !!mergedRules[ruleName];
  });
  function forMatch(match) {
    var enabled = match[1].toUpperCase() === "EN";
    var items = match[2] ?
      match[2].trim().toUpperCase().split(/\s+/) :
      allRuleNames;
    items.forEach(function forItem(nameUpper) {
      (aliasToRuleNames[nameUpper] || []).forEach(function forRule(ruleName) {
        enabledRules[ruleName] = enabled;
      });
    });
  }
  var enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
  lines.forEach(function forLine(line) {
    if (!noInlineConfig) {
      var match = shared.inlineCommentRe.exec(line);
      if (match) {
        enabledRules = shared.clone(enabledRules);
        while (match) {
          forMatch(match);
          match = shared.inlineCommentRe.exec(line);
        }
      }
    }
    enabledRulesPerLineNumber.push(enabledRules);
  });
  return enabledRulesPerLineNumber;
}

// Array.sort comparison for objects in errors array
function lineNumberComparison(a, b) {
  return a.lineNumber - b.lineNumber;
}

// Function to return unique values from a sorted errors array
function uniqueFilterForSortedErrors(value, index, array) {
  return (index === 0) || (value.lineNumber > array[index - 1].lineNumber);
}

// Lints a single string
function lintContent(
  content, config, frontMatter, noInlineConfig, resultVersion) {
  // Remove UTF-8 byte order marker (if present)
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }
  // Remove front matter
  var removeFrontMatterResult = removeFrontMatter(content, frontMatter);
  content = removeFrontMatterResult.content;
  var frontMatterLines = removeFrontMatterResult.frontMatterLines;
  // Ignore the content of HTML comments
  content = shared.clearHtmlCommentText(content);
  // Parse content into tokens and lines
  var tokens = md.parse(content, {});
  var lines = content.split(shared.newLineRe);
  var tokenLists = annotateTokens(tokens, lines);
  var aliasToRuleNames = mapAliasToRuleNames(rules);
  var mergedRules = mergeRulesAndSanitize(config, aliasToRuleNames);
  var enabledRulesPerLineNumber = getEnabledRulesPerLineNumber(
    lines, frontMatterLines, noInlineConfig, mergedRules, aliasToRuleNames);
  // Create parameters for rules
  var params = {
    "tokens": tokens,
    "tokenLists": tokenLists,
    "lines": lines,
    "frontMatterLines": frontMatterLines
  };
  // Run each rule
  var result = (resultVersion === 0) ? {} : [];
  rules.forEach(function forRule(rule) {
    // Configure rule
    var ruleName = rule.names[0].toUpperCase();
    params.config = mergedRules[ruleName];
    var errors = [];
    function onError(errorInfo) {
      errors.push({
        "lineNumber": errorInfo.lineNumber + frontMatterLines.length,
        "detail": errorInfo.detail || null,
        "context": errorInfo.context || null,
        "range": errorInfo.range || null
      });
    }
    rule.function(params, onError);
    // Record any errors (significant performance benefit from length check)
    if (errors.length) {
      errors.sort(lineNumberComparison);
      var filteredErrors = errors
        .filter(uniqueFilterForSortedErrors)
        .filter(function removeDisabledRules(error) {
          return enabledRulesPerLineNumber[error.lineNumber][ruleName];
        })
        .map(function formatResults(error) {
          if (resultVersion === 0) {
            return error.lineNumber;
          }
          var errorObject = {};
          errorObject.lineNumber = error.lineNumber;
          if (resultVersion === 1) {
            errorObject.ruleName = rule.names[0];
            errorObject.ruleAlias = rule.names[1];
          } else {
            errorObject.ruleNames = rule.names;
          }
          errorObject.ruleDescription = rule.description;
          errorObject.errorDetail = error.detail;
          errorObject.errorContext = error.context;
          errorObject.errorRange = error.range;
          return errorObject;
        });
      if (filteredErrors.length) {
        if (resultVersion === 0) {
          result[ruleName] = filteredErrors;
        } else {
          result.push.apply(result, filteredErrors);
        }
      }
    }
  });
  return result;
}

// Lints a single file
function lintFile(
  file,
  config,
  frontMatter,
  noInlineConfig,
  resultVersion,
  synchronous,
  callback) {
  function lintContentWrapper(err, content) {
    if (err) {
      return callback(err);
    }
    var result = lintContent(
      content, config, frontMatter, noInlineConfig, resultVersion);
    callback(null, result);
  }
  // Make a/synchronous call to read file
  if (synchronous) {
    lintContentWrapper(null, fs.readFileSync(file, shared.utf8Encoding));
  } else {
    fs.readFile(file, shared.utf8Encoding, lintContentWrapper);
  }
}

function lintInput(options, synchronous, callback) {
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
  var config = options.config || { "default": true };
  var frontMatter = (options.frontMatter === undefined) ?
    shared.frontMatterRe : options.frontMatter;
  var noInlineConfig = !!options.noInlineConfig;
  var resultVersion = (options.resultVersion === undefined) ?
    2 : options.resultVersion;
  var results = new Results();
  // Helper to lint the next file in the array
  function lintFilesArray() {
    var file = files.shift();
    if (file) {
      lintFile(
        file,
        config,
        frontMatter,
        noInlineConfig,
        resultVersion,
        synchronous,
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
    var result = lintContent(
      strings[key] || "",
      config,
      frontMatter,
      noInlineConfig,
      resultVersion);
    results[key] = result;
  });
  // Lint files
  lintFilesArray();
}

/**
 * Lint specified Markdown files.
 *
 * @param {Object} options Configuration options.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function markdownlint(options, callback) {
  return lintInput(options, false, callback);
}

/**
 * Lint specified Markdown files synchronously.
 *
 * @param {Object} options Configuration options.
 * @returns {Object} Result object.
 */
function markdownlintSync(options) {
  var results = null;
  lintInput(options, true, function callback(error, res) {
    // Unreachable; no code path in the synchronous case passes error
    // if (error) {
    //   throw error;
    // }
    results = res;
  });
  return results;
}

/**
 * Read specified configuration file.
 *
 * @param {String} file Configuration file name/path.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function readConfig(file, callback) {
  // Read file
  fs.readFile(file, shared.utf8Encoding, function handleFile(err, content) {
    if (err) {
      return callback(err);
    }
    // Parse file
    var config = null;
    try {
      config = JSON.parse(content);
    } catch (ex) {
      return callback(ex);
    }
    if (config.extends) {
      // Extend configuration
      var extendsFile = path.resolve(path.dirname(file), config.extends);
      readConfig(extendsFile, function handleConfig(errr, extendsConfig) {
        if (errr) {
          return callback(errr);
        }
        delete config.extends;
        callback(null, shared.assign(extendsConfig, config));
      });
    } else {
      callback(null, config);
    }
  });
}

/**
 * Read specified configuration file synchronously.
 *
 * @param {String} file Configuration file name/path.
 * @returns {Object} Configuration object.
 */
function readConfigSync(file) {
  // Parse file
  var config = JSON.parse(fs.readFileSync(file, shared.utf8Encoding));
  if (config.extends) {
    // Extend configuration
    config = shared.assign(
      readConfigSync(path.resolve(path.dirname(file), config.extends)),
      config);
    delete config.extends;
  }
  return config;
}

// Export a/synchronous APIs
markdownlint.sync = markdownlintSync;
markdownlint.readConfig = readConfig;
markdownlint.readConfigSync = readConfigSync;
module.exports = markdownlint;

// @ts-check

"use strict";

var fs = require("fs");
var path = require("path");
var md = require("markdown-it")({ "html": true });
var rules = require("./rules");
var shared = require("./shared");

// Validates the list of rules for structure and reuse
function validateRuleList(ruleList) {
  var result = null;
  if (ruleList.length === rules.length) {
    // No need to validate if only using built-in rules
    return result;
  }
  var allIds = {};
  ruleList.forEach(function forRule(rule, index) {
    var customIndex = index - rules.length;
    function newError(property) {
      return new Error(
        "Property '" + property + "' of custom rule at index " +
        customIndex + " is incorrect.");
    }
    [ "names", "tags" ].forEach(function forProperty(property) {
      var value = rule[property];
      if (!result &&
        (!value || !Array.isArray(value) || (value.length === 0) ||
         !value.every(shared.isString) || value.some(shared.isEmptyString))) {
        result = newError(property);
      }
    });
    [
      [ "description", "string" ],
      [ "function", "function" ]
    ].forEach(function forProperty(propertyInfo) {
      var property = propertyInfo[0];
      var value = rule[property];
      if (!result && (!value || (typeof value !== propertyInfo[1]))) {
        result = newError(property);
      }
    });
    if (!result) {
      rule.names.forEach(function forName(name) {
        var nameUpper = name.toUpperCase();
        if (!result && (allIds[nameUpper] !== undefined)) {
          result = new Error("Name '" + name + "' of custom rule at index " +
            customIndex + " is already used as a name or tag.");
        }
        allIds[nameUpper] = true;
      });
      rule.tags.forEach(function forTag(tag) {
        var tagUpper = tag.toUpperCase();
        if (!result && allIds[tagUpper]) {
          result = new Error("Tag '" + tag + "' of custom rule at index " +
            customIndex + " is already used as a name.");
        }
        allIds[tagUpper] = false;
      });
    }
  });
  return result;
}

// Class for results with toString for pretty display
function newResults(ruleList) {
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
          ruleList.forEach(function forRule(rule) {
            var ruleName = rule.names[0].toUpperCase();
            ruleNameToRule[ruleName] = rule;
          });
        }
        Object.keys(fileResults).forEach(function forRule(ruleName) {
          var rule = ruleNameToRule[ruleName.toUpperCase()];
          var ruleResults = fileResults[ruleName];
          ruleResults.forEach(function forLine(lineNumber) {
            var nameIndex = Math.min(useAlias ? 1 : 0, rule.names.length - 1);
            var result =
              file + ": " +
              lineNumber + ": " +
              rule.names[nameIndex] + " " +
              rule.description;
            results.push(result);
          });
        });
      }
    });
    return results.join("\n");
  };
  return new Results();
}

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
  });
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

// Apply (and normalize) config
function getEffectiveConfig(ruleList, config, aliasToRuleNames) {
  var defaultKey = Object.keys(config).filter(function forKey(key) {
    return key.toUpperCase() === "DEFAULT";
  });
  var ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
  var effectiveConfig = {};
  ruleList.forEach(function forRule(rule) {
    var ruleName = rule.names[0].toUpperCase();
    effectiveConfig[ruleName] = ruleDefault;
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
      effectiveConfig[ruleName] = value;
    });
  });
  return effectiveConfig;
}

// Create mapping of enabled rules per line
function getEnabledRulesPerLineNumber(
  ruleList, lines, frontMatterLines, noInlineConfig,
  effectiveConfig, aliasToRuleNames) {
  var enabledRules = {};
  var allRuleNames = [];
  ruleList.forEach(function forRule(rule) {
    var ruleName = rule.names[0].toUpperCase();
    allRuleNames.push(ruleName);
    enabledRules[ruleName] = !!effectiveConfig[ruleName];
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
  ruleList, content, config, frontMatter, noInlineConfig, resultVersion,
  callback) {
  // Remove UTF-8 byte order marker (if present)
  content = content.replace(/^\ufeff/, "");
  // Remove front matter
  var removeFrontMatterResult = removeFrontMatter(content, frontMatter);
  var frontMatterLines = removeFrontMatterResult.frontMatterLines;
  // Ignore the content of HTML comments
  content = shared.clearHtmlCommentText(removeFrontMatterResult.content);
  // Parse content into tokens and lines
  var tokens = md.parse(content, {});
  var lines = content.split(shared.newLineRe);
  annotateTokens(tokens, lines);
  var aliasToRuleNames = mapAliasToRuleNames(ruleList);
  var effectiveConfig = getEffectiveConfig(ruleList, config, aliasToRuleNames);
  var enabledRulesPerLineNumber = getEnabledRulesPerLineNumber(
    ruleList, lines, frontMatterLines, noInlineConfig,
    effectiveConfig, aliasToRuleNames);
  // Create parameters for rules
  var params = {
    "tokens": tokens,
    "lines": lines,
    "frontMatterLines": frontMatterLines
  };
  shared.makeTokenCache(params);
  // Function to run for each rule
  var result = (resultVersion === 0) ? {} : [];
  function forRule(rule) {
    // Configure rule
    var ruleNameFriendly = rule.names[0];
    var ruleName = ruleNameFriendly.toUpperCase();
    params.config = effectiveConfig[ruleName];
    function throwError(property) {
      throw new Error(
        "Property '" + property + "' of onError parameter is incorrect.");
    }
    var errors = [];
    function onError(errorInfo) {
      if (!errorInfo ||
        !errorInfo.lineNumber ||
        !shared.isNumber(errorInfo.lineNumber)) {
        throwError("lineNumber");
      }
      if (errorInfo.detail &&
        !shared.isString(errorInfo.detail)) {
        throwError("detail");
      }
      if (errorInfo.context &&
        !shared.isString(errorInfo.context)) {
        throwError("context");
      }
      if (errorInfo.range &&
        (!Array.isArray(errorInfo.range) ||
         (errorInfo.range.length !== 2) ||
         !shared.isNumber(errorInfo.range[0]) ||
         !shared.isNumber(errorInfo.range[1]))) {
        throwError("range");
      }
      errors.push({
        "lineNumber": errorInfo.lineNumber + frontMatterLines.length,
        "detail": errorInfo.detail || null,
        "context": errorInfo.context || null,
        "range": errorInfo.range || null
      });
    }
    // Call (possibly external) rule function
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
            errorObject.ruleName = ruleNameFriendly;
            errorObject.ruleAlias = rule.names[1] || rule.names[0];
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
          result[ruleNameFriendly] = filteredErrors;
        } else {
          Array.prototype.push.apply(result, filteredErrors);
        }
      }
    }
  }
  // Run all rules
  try {
    ruleList.forEach(forRule);
  } catch (ex) {
    shared.makeTokenCache(null);
    return callback(ex);
  }
  shared.makeTokenCache(null);
  callback(null, result);
}

// Lints a single file
function lintFile(
  ruleList,
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
    lintContent(ruleList, content, config, frontMatter, noInlineConfig,
      resultVersion, callback);
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
  var ruleList = rules.concat(options.customRules || []);
  var ruleErr = validateRuleList(ruleList);
  if (ruleErr) {
    return callback(ruleErr);
  }
  var files = [];
  if (Array.isArray(options.files)) {
    files = options.files.slice();
  } else if (options.files) {
    files = [ String(options.files) ];
  }
  var strings = options.strings || {};
  var stringsKeys = Object.keys(strings);
  var config = options.config || { "default": true };
  var frontMatter = (options.frontMatter === undefined) ?
    shared.frontMatterRe : options.frontMatter;
  var noInlineConfig = !!options.noInlineConfig;
  var resultVersion = (options.resultVersion === undefined) ?
    2 : options.resultVersion;
  var results = newResults(ruleList);
  // Helper to lint the next string or file
  function lintNextItem() {
    var iterating = true;
    var item = null;
    function lintNextItemCallback(err, result) {
      if (err) {
        iterating = false;
        return callback(err);
      }
      results[item] = result;
      if (!iterating) {
        lintNextItem();
      }
    }
    while (iterating) {
      if ((item = stringsKeys.shift())) {
        lintContent(
          ruleList,
          strings[item] || "",
          config,
          frontMatter,
          noInlineConfig,
          resultVersion,
          lintNextItemCallback);
      } else if ((item = files.shift())) {
        iterating = synchronous;
        lintFile(
          ruleList,
          item,
          config,
          frontMatter,
          noInlineConfig,
          resultVersion,
          synchronous,
          lintNextItemCallback);
      } else {
        return callback(null, results);
      }
    }
  }
  lintNextItem();
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
    if (error) {
      throw error;
    }
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

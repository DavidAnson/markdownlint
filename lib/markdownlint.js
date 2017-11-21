"use strict";

var fs = require("fs");
var path = require("path");
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
  // console.log(
  //   "* **[" + rule.name + "](doc/Rules.md#" + rule.name.toLowerCase() +
  //    ")** *" + rule.aliases.join(", ") + "* - " + rule.desc);
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
    if (Array.isArray(fileResults)) {
      fileResults.forEach(function forResult(result) {
        results.push(
          file + ": " +
          result.lineNumber + ": " +
          result.ruleName + "/" +
          result.ruleAlias + " " +
          result.ruleDescription +
          (result.errorDetail ?
            " [" + result.errorDetail + "]" :
            "") +
          (result.errorContext ?
            " [Context: \"" + result.errorContext + "\"]" :
            ""));
      });
    } else {
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
    }
  });
  return results.join("\n");
};

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
  // Remove front matter (if present at beginning of content)
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
  // Ignore the content of HTML comments
  content = shared.clearHtmlCommentText(content);
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
    params.options = mergedRules[rule.name];
    var errors = [];
    function addError(lineNumber, detail, context, range) {
      errors.push({
        "lineNumber": lineNumber + frontMatterLines.length,
        "detail": detail || null,
        "context": context || null,
        "range": range || null
      });
    }
    errors.add = function add(lineNumber) {
      addError(lineNumber);
    };
    errors.addDetail = function addDetail(lineNumber, detail) {
      addError(lineNumber, detail);
    };
    errors.addDetailIf =
      function addDetailIf(lineNumber, expected, actual, detail, range) {
        if (expected !== actual) {
          addError(
            lineNumber,
            "Expected: " + expected + "; Actual: " + actual +
              (detail ? "; " + detail : ""),
            null,
            range);
        }
      };
    errors.addContext =
      function addContext(lineNumber, context, left, right, range) {
        if (context.length <= 30) {
          // Nothing to do
        } else if (left && right) {
          context = context.substr(0, 15) + "..." + context.substr(-15);
        } else if (right) {
          context = "..." + context.substr(-30);
        } else {
          context = context.substr(0, 30) + "...";
        }
        addError(lineNumber, null, context, range);
      };
    rule.func(params, errors);
    // Record any errors (significant performance benefit from length check)
    if (errors.length) {
      errors.sort(lineNumberComparison);
      var filteredErrors = errors
        .filter(uniqueFilterForSortedErrors)
        .filter(function removeDisabledRules(error) {
          return enabledRulesPerLineNumber[error.lineNumber][rule.name];
        })
        .map(function formatResults(error) {
          if (resultVersion === 0) {
            return error.lineNumber;
          }
          var range = error.range;
          var regexp = rule.regexp;
          if (!range && regexp) {
            if (typeof regexp === "function") {
              regexp = regexp(params.options);
            }
            var lineIndex = error.lineNumber - frontMatterLines.length - 1;
            var match = lines[lineIndex].match(regexp);
            if (match) {
              var column = match.index + 1;
              var length = match[0].length;
              if (match[2]) {
                column += match[1].length;
                length -= match[1].length;
              }
              range = [ column, length ];
            }
          }
          return {
            "lineNumber": error.lineNumber,
            "ruleName": rule.name,
            "ruleAlias": rule.aliases[0],
            "ruleDescription": rule.desc,
            "errorDetail": error.detail,
            "errorContext": error.context,
            "errorRange": range
          };
        });
      if (filteredErrors.length) {
        if (resultVersion === 0) {
          result[rule.name] = filteredErrors;
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

// Callback used as a sentinel by markdownlintSync
function markdownlintSynchronousCallback() {
  // Unreachable; no code path in the synchronous case passes err
  // if (err) {
  //   throw err; // Synchronous APIs throw
  // }
}

/**
 * Lint specified Markdown files.
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
  var config = options.config || { "default": true };
  var frontMatter = (options.frontMatter === undefined) ?
    shared.frontMatterRe : options.frontMatter;
  var noInlineConfig = !!options.noInlineConfig;
  var resultVersion = (options.resultVersion === undefined) ?
    1 : options.resultVersion;
  var synchronous = (callback === markdownlintSynchronousCallback);
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
  // Return results
  if (synchronous) {
    return results;
  }
}

/**
 * Lint specified Markdown files synchronously.
 *
 * @param {Object} options Configuration options.
 * @returns {Object} Result object.
 */
function markdownlintSync(options) {
  return markdownlint(options, markdownlintSynchronousCallback);
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
module.exports = markdownlint;
module.exports.sync = markdownlintSync;
module.exports.readConfig = readConfig;
module.exports.readConfigSync = readConfigSync;

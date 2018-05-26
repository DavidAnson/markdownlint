// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const md = require("markdown-it")({ "html": true });
const rules = require("./rules");
const shared = require("./shared");

// Validates the list of rules for structure and reuse
function validateRuleList(ruleList) {
  let result = null;
  if (ruleList.length === rules.length) {
    // No need to validate if only using built-in rules
    return result;
  }
  const allIds = {};
  ruleList.forEach(function forRule(rule, index) {
    const customIndex = index - rules.length;
    function newError(property) {
      return new Error(
        "Property '" + property + "' of custom rule at index " +
        customIndex + " is incorrect.");
    }
    [ "names", "tags" ].forEach(function forProperty(property) {
      const value = rule[property];
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
      const property = propertyInfo[0];
      const value = rule[property];
      if (!result && (!value || (typeof value !== propertyInfo[1]))) {
        result = newError(property);
      }
    });
    if (!result) {
      rule.names.forEach(function forName(name) {
        const nameUpper = name.toUpperCase();
        if (!result && (allIds[nameUpper] !== undefined)) {
          result = new Error("Name '" + name + "' of custom rule at index " +
            customIndex + " is already used as a name or tag.");
        }
        allIds[nameUpper] = true;
      });
      rule.tags.forEach(function forTag(tag) {
        const tagUpper = tag.toUpperCase();
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
    const that = this;
    let ruleNameToRule = null;
    const results = [];
    Object.keys(that).forEach(function forFile(file) {
      const fileResults = that[file];
      if (Array.isArray(fileResults)) {
        fileResults.forEach(function forResult(result) {
          const ruleMoniker = result.ruleNames ?
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
            const ruleName = rule.names[0].toUpperCase();
            ruleNameToRule[ruleName] = rule;
          });
        }
        Object.keys(fileResults).forEach(function forRule(ruleName) {
          const rule = ruleNameToRule[ruleName.toUpperCase()];
          const ruleResults = fileResults[ruleName];
          ruleResults.forEach(function forLine(lineNumber) {
            const nameIndex = Math.min(useAlias ? 1 : 0, rule.names.length - 1);
            const result =
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
  let frontMatterLines = [];
  if (frontMatter) {
    const frontMatterMatch = content.match(frontMatter);
    if (frontMatterMatch && !frontMatterMatch.index) {
      const contentMatched = frontMatterMatch[0];
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
  let tbodyMap = null;
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
      let lineNumber = token.lineNumber;
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
  const aliasToRuleNames = {};
  // const tagToRuleNames = {};
  ruleList.forEach(function forRule(rule) {
    const ruleName = rule.names[0].toUpperCase();
    // The following is useful for updating README.md:
    // console.log(
    //   "* **[" + ruleName + "](doc/Rules.md#" + ruleName.toLowerCase() +
    //    ")** *" + rule.names.slice(1).join("/") + "* - " + rule.description);
    rule.names.forEach(function forName(name) {
      const nameUpper = name.toUpperCase();
      aliasToRuleNames[nameUpper] = [ ruleName ];
    });
    rule.tags.forEach(function forTag(tag) {
      const tagUpper = tag.toUpperCase();
      const ruleNames = aliasToRuleNames[tagUpper] || [];
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
  const defaultKey = Object.keys(config).filter(function forKey(key) {
    return key.toUpperCase() === "DEFAULT";
  });
  const ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
  const effectiveConfig = {};
  ruleList.forEach(function forRule(rule) {
    const ruleName = rule.names[0].toUpperCase();
    effectiveConfig[ruleName] = ruleDefault;
  });
  Object.keys(config).forEach(function forKey(key) {
    let value = config[key];
    if (value) {
      if (!(value instanceof Object)) {
        value = {};
      }
    } else {
      value = false;
    }
    const keyUpper = key.toUpperCase();
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
  let enabledRules = {};
  const allRuleNames = [];
  ruleList.forEach(function forRule(rule) {
    const ruleName = rule.names[0].toUpperCase();
    allRuleNames.push(ruleName);
    enabledRules[ruleName] = !!effectiveConfig[ruleName];
  });
  function forMatch(match) {
    const enabled = match[1].toUpperCase() === "EN";
    const items = match[2] ?
      match[2].trim().toUpperCase().split(/\s+/) :
      allRuleNames;
    items.forEach(function forItem(nameUpper) {
      (aliasToRuleNames[nameUpper] || []).forEach(function forRule(ruleName) {
        enabledRules[ruleName] = enabled;
      });
    });
  }
  const enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
  lines.forEach(function forLine(line) {
    if (!noInlineConfig) {
      let match = shared.inlineCommentRe.exec(line);
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
  ruleList, name, content, config, frontMatter, noInlineConfig, resultVersion,
  callback) {
  // Remove UTF-8 byte order marker (if present)
  content = content.replace(/^\ufeff/, "");
  // Remove front matter
  const removeFrontMatterResult = removeFrontMatter(content, frontMatter);
  const frontMatterLines = removeFrontMatterResult.frontMatterLines;
  // Ignore the content of HTML comments
  content = shared.clearHtmlCommentText(removeFrontMatterResult.content);
  // Parse content into tokens and lines
  const tokens = md.parse(content, {});
  const lines = content.split(shared.newLineRe);
  annotateTokens(tokens, lines);
  const aliasToRuleNames = mapAliasToRuleNames(ruleList);
  const effectiveConfig =
    getEffectiveConfig(ruleList, config, aliasToRuleNames);
  const enabledRulesPerLineNumber = getEnabledRulesPerLineNumber(
    ruleList, lines, frontMatterLines, noInlineConfig,
    effectiveConfig, aliasToRuleNames);
  // Create parameters for rules
  const params = {
    name,
    tokens,
    lines,
    frontMatterLines
  };
  shared.makeTokenCache(params);
  // Function to run for each rule
  const result = (resultVersion === 0) ? {} : [];
  function forRule(rule) {
    // Configure rule
    const ruleNameFriendly = rule.names[0];
    const ruleName = ruleNameFriendly.toUpperCase();
    params.config = effectiveConfig[ruleName];
    function throwError(property) {
      throw new Error(
        "Property '" + property + "' of onError parameter is incorrect.");
    }
    const errors = [];
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
      const filteredErrors = errors
        .filter(uniqueFilterForSortedErrors)
        .filter(function removeDisabledRules(error) {
          return enabledRulesPerLineNumber[error.lineNumber][ruleName];
        })
        .map(function formatResults(error) {
          if (resultVersion === 0) {
            return error.lineNumber;
          }
          const errorObject = {};
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
    lintContent(ruleList, file, content, config, frontMatter, noInlineConfig,
      resultVersion, callback);
  }
  // Make a/synchronous call to read file
  if (synchronous) {
    lintContentWrapper(null, fs.readFileSync(file, shared.utf8Encoding));
  } else {
    fs.readFile(file, shared.utf8Encoding, lintContentWrapper);
  }
}

// Lints files and strings
function lintInput(options, synchronous, callback) {
  // Normalize inputs
  options = options || {};
  callback = callback || function noop() {};
  const ruleList = rules.concat(options.customRules || []);
  const ruleErr = validateRuleList(ruleList);
  if (ruleErr) {
    return callback(ruleErr);
  }
  let files = [];
  if (Array.isArray(options.files)) {
    files = options.files.slice();
  } else if (options.files) {
    files = [ String(options.files) ];
  }
  const strings = options.strings || {};
  const stringsKeys = Object.keys(strings);
  const config = options.config || { "default": true };
  const frontMatter = (options.frontMatter === undefined) ?
    shared.frontMatterRe : options.frontMatter;
  const noInlineConfig = !!options.noInlineConfig;
  const resultVersion = (options.resultVersion === undefined) ?
    2 : options.resultVersion;
  const results = newResults(ruleList);
  // Helper to lint the next string or file
  function lintNextItem() {
    let iterating = true;
    let item = null;
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
          item,
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
  let results = null;
  lintInput(options, true, function callback(error, res) {
    if (error) {
      throw error;
    }
    results = res;
  });
  return results;
}

// Parses the content of a configuration file
function parseConfiguration(name, content, parsers) {
  let config = null;
  let message = "";
  const errors = [];
  // Try each parser
  (parsers || [ JSON.parse ]).every((parser) => {
    try {
      config = parser(content);
    } catch (ex) {
      errors.push(ex.message);
    }
    return !config;
  });
  // Message if unable to parse
  if (!config) {
    errors.unshift(`Unable to parse '${name}'`);
    message = errors.join("; ");
  }
  return {
    config,
    message
  };
}

/**
 * Read specified configuration file.
 *
 * @param {String} file Configuration file name/path.
 * @param {Array} [parsers] Optional parsing function(s).
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function readConfig(file, parsers, callback) {
  if (!callback) {
    // @ts-ignore
    callback = parsers;
    parsers = null;
  }
  // Read file
  fs.readFile(file, shared.utf8Encoding, (err, content) => {
    if (err) {
      return callback(err);
    }
    // Try to parse file
    const { config, message } = parseConfiguration(file, content, parsers);
    if (!config) {
      return callback(new Error(message));
    }
    // Extend configuration
    const configExtends = config.extends;
    if (configExtends) {
      delete config.extends;
      const extendsFile = path.resolve(path.dirname(file), configExtends);
      readConfig(extendsFile, parsers, (errr, extendsConfig) => {
        if (errr) {
          return callback(errr);
        }
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
 * @param {Array} [parsers] Optional parsing function(s).
 * @returns {Object} Configuration object.
 */
function readConfigSync(file, parsers) {
  // Read file
  const content = fs.readFileSync(file, shared.utf8Encoding);
  // Try to parse file
  const { config, message } = parseConfiguration(file, content, parsers);
  if (!config) {
    throw new Error(message);
  }
  // Extend configuration
  const configExtends = config.extends;
  if (configExtends) {
    delete config.extends;
    return shared.assign(
      readConfigSync(path.resolve(path.dirname(file), configExtends), parsers),
      config);
  }
  return config;
}

// Export a/synchronous APIs
markdownlint.sync = markdownlintSync;
markdownlint.readConfig = readConfig;
markdownlint.readConfigSync = readConfigSync;
module.exports = markdownlint;

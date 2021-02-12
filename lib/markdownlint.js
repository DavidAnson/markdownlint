// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const markdownIt = require("markdown-it");
const rules = require("./rules");
const helpers = require("../helpers");
const cache = require("./cache");

// @ts-ignore
// eslint-disable-next-line camelcase, max-len, no-inline-comments, no-undef
const dynamicRequire = (typeof __non_webpack_require__ === "undefined") ? require : /* c8 ignore next */ __non_webpack_require__;
// Capture native require implementation for dynamic loading of modules

const deprecatedRuleNames = [ "MD002", "MD006" ];

/**
 * Validate the list of rules for structure and reuse.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {string} Error message if validation fails.
 */
function validateRuleList(ruleList) {
  let result = null;
  if (ruleList.length === rules.length) {
    // No need to validate if only using built-in rules
    return result;
  }
  const allIds = {};
  ruleList.forEach(function forRule(rule, index) {
    const customIndex = index - rules.length;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function newError(property) {
      return new Error(
        "Property '" + property + "' of custom rule at index " +
        customIndex + " is incorrect.");
    }
    [ "names", "tags" ].forEach(function forProperty(property) {
      const value = rule[property];
      if (!result &&
        (!value || !Array.isArray(value) || (value.length === 0) ||
         !value.every(helpers.isString) || value.some(helpers.isEmptyString))) {
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
    if (
      !result &&
      rule.information &&
      (Object.getPrototypeOf(rule.information) !== URL.prototype)
    ) {
      result = newError("information");
    }
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

/**
 * Creates a LintResults instance with toString for pretty display.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {LintResults} New LintResults instance.
 */
function newResults(ruleList) {
  const lintResults = {};
  // eslint-disable-next-line jsdoc/require-jsdoc
  function toString(useAlias) {
    let ruleNameToRule = null;
    const results = [];
    const keys = Object.keys(lintResults);
    keys.sort();
    keys.forEach(function forFile(file) {
      const fileResults = lintResults[file];
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
  }
  Object.defineProperty(lintResults, "toString", { "value": toString });
  // @ts-ignore
  return lintResults;
}

/**
 * Remove front matter (if present at beginning of content).
 *
 * @param {string} content Markdown content.
 * @param {RegExp} frontMatter Regular expression to match front matter.
 * @returns {Object} Trimmed content and front matter lines.
 */
function removeFrontMatter(content, frontMatter) {
  let frontMatterLines = [];
  if (frontMatter) {
    const frontMatterMatch = content.match(frontMatter);
    if (frontMatterMatch && !frontMatterMatch.index) {
      const contentMatched = frontMatterMatch[0];
      content = content.slice(contentMatched.length);
      frontMatterLines = contentMatched.split(helpers.newLineRe);
      if ((frontMatterLines.length > 0) &&
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

/**
 * Annotate tokens with line/lineNumber.
 *
 * @param {MarkdownItToken[]} tokens Array of markdown-it tokens.
 * @param {string[]} lines Lines of Markdown content.
 * @returns {void}
 */
function annotateTokens(tokens, lines) {
  let tableMap = null;
  tokens.forEach(function forToken(token) {
    // Handle missing maps for table head/body
    if (
      (token.type === "thead_open") ||
      (token.type === "tbody_open")
    ) {
      tableMap = token.map.slice();
    } else if (
      (token.type === "tr_close") &&
      tableMap
    ) {
      tableMap[0]++;
    } else if (
      (token.type === "thead_close") ||
      (token.type === "tbody_close")
    ) {
      tableMap = null;
    }
    if (tableMap && !token.map) {
      token.map = tableMap.slice();
    }
    // Update token metadata
    if (token.map) {
      token.line = lines[token.map[0]];
      token.lineNumber = token.map[0] + 1;
      // Trim bottom of token to exclude whitespace lines
      while (token.map[1] && !((lines[token.map[1] - 1] || "").trim())) {
        token.map[1]--;
      }
      // Annotate children with lineNumber
      let lineNumber = token.lineNumber;
      const codeSpanExtraLines = [];
      helpers.forEachInlineCodeSpan(
        token.content,
        function handleInlineCodeSpan(code) {
          codeSpanExtraLines.push(code.split(helpers.newLineRe).length - 1);
        }
      );
      (token.children || []).forEach(function forChild(child) {
        child.lineNumber = lineNumber;
        child.line = lines[lineNumber - 1];
        if ((child.type === "softbreak") || (child.type === "hardbreak")) {
          lineNumber++;
        } else if (child.type === "code_inline") {
          lineNumber += codeSpanExtraLines.shift();
        }
      });
    }
  });
}

/**
 * Map rule names/tags to canonical rule name.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {Object.<string, string[]>} Map of alias to rule name.
 */
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
  // @ts-ignore
  return aliasToRuleNames;
}

/**
 * Apply (and normalize) configuration object.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {Configuration} config Configuration object.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {Configuration} Effective configuration.
 */
function getEffectiveConfig(ruleList, config, aliasToRuleNames) {
  const defaultKey = Object.keys(config).filter(
    (key) => key.toUpperCase() === "DEFAULT"
  );
  const ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
  const effectiveConfig = {};
  ruleList.forEach((rule) => {
    const ruleName = rule.names[0].toUpperCase();
    effectiveConfig[ruleName] = ruleDefault;
  });
  deprecatedRuleNames.forEach((ruleName) => {
    effectiveConfig[ruleName] = false;
  });
  Object.keys(config).forEach((key) => {
    let value = config[key];
    if (value) {
      if (!(value instanceof Object)) {
        value = {};
      }
    } else {
      value = false;
    }
    const keyUpper = key.toUpperCase();
    (aliasToRuleNames[keyUpper] || []).forEach((ruleName) => {
      effectiveConfig[ruleName] = value;
    });
  });
  return effectiveConfig;
}

/**
 * Create a mapping of enabled rules per line.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string[]} lines List of content lines.
 * @param {string[]} frontMatterLines List of front matter lines.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {Configuration} config Configuration object.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {Object} Effective configuration and enabled rules per line number.
 */
function getEnabledRulesPerLineNumber(
  ruleList,
  lines,
  frontMatterLines,
  noInlineConfig,
  config,
  aliasToRuleNames) {
  // Shared variables
  let enabledRules = {};
  let capturedRules = {};
  const allRuleNames = [];
  const enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
  // Helper functions
  // eslint-disable-next-line jsdoc/require-jsdoc
  function handleInlineConfig(perLine, forEachMatch, forEachLine) {
    const input = perLine ? lines : [ lines.join("\n") ];
    input.forEach((line, lineIndex) => {
      if (!noInlineConfig) {
        let match = null;
        while ((match = helpers.inlineCommentRe.exec(line))) {
          const action = (match[1] || match[3]).toUpperCase();
          const parameter = match[2] || match[4];
          forEachMatch(action, parameter, lineIndex + 1);
        }
      }
      if (forEachLine) {
        forEachLine();
      }
    });
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function configureFile(action, parameter) {
    if (action === "CONFIGURE-FILE") {
      try {
        const json = JSON.parse(parameter);
        config = {
          ...config,
          ...json
        };
      } catch {
        // Ignore parse errors for inline configuration
      }
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function applyEnableDisable(action, parameter, state) {
    const enabled = (action.startsWith("ENABLE"));
    const items = parameter ?
      parameter.trim().toUpperCase().split(/\s+/) :
      allRuleNames;
    items.forEach((nameUpper) => {
      (aliasToRuleNames[nameUpper] || []).forEach((ruleName) => {
        state[ruleName] = enabled;
      });
    });
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function enableDisableFile(action, parameter) {
    if ((action === "ENABLE-FILE") || (action === "DISABLE-FILE")) {
      applyEnableDisable(action, parameter, enabledRules);
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function captureRestoreEnableDisable(action, parameter) {
    if (action === "CAPTURE") {
      capturedRules = { ...enabledRules };
    } else if (action === "RESTORE") {
      enabledRules = { ...capturedRules };
    } else if ((action === "ENABLE") || (action === "DISABLE")) {
      enabledRules = { ...enabledRules };
      applyEnableDisable(action, parameter, enabledRules);
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function updateLineState() {
    enabledRulesPerLineNumber.push({ ...enabledRules });
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function disableNextLine(action, parameter, lineNumber) {
    if (action === "DISABLE-NEXT-LINE") {
      applyEnableDisable(
        action,
        parameter,
        enabledRulesPerLineNumber[lineNumber + 1] || {}
      );
    }
  }
  // Handle inline comments
  handleInlineConfig(false, configureFile);
  const effectiveConfig = getEffectiveConfig(
    ruleList, config, aliasToRuleNames);
  ruleList.forEach((rule) => {
    const ruleName = rule.names[0].toUpperCase();
    allRuleNames.push(ruleName);
    enabledRules[ruleName] = !!effectiveConfig[ruleName];
  });
  capturedRules = enabledRules;
  handleInlineConfig(true, enableDisableFile);
  handleInlineConfig(true, captureRestoreEnableDisable, updateLineState);
  handleInlineConfig(true, disableNextLine);
  // Return results
  return {
    effectiveConfig,
    enabledRulesPerLineNumber
  };
}

/**
 * Compare function for Array.prototype.sort for ascending order of errors.
 *
 * @param {LintError} a First error.
 * @param {LintError} b Second error.
 * @returns {number} Positive value if a>b, negative value if b<a, 0 otherwise.
 */
function lineNumberComparison(a, b) {
  return a.lineNumber - b.lineNumber;
}

/**
 * Filter function to include everything.
 *
 * @returns {boolean} True.
 */
function filterAllValues() {
  return true;
}

/**
 * Function to return unique values from a sorted errors array.
 *
 * @param {LintError} value Error instance.
 * @param {number} index Index in array.
 * @param {LintError[]} array Array of errors.
 * @returns {boolean} Filter value.
 */
function uniqueFilterForSortedErrors(value, index, array) {
  return (index === 0) || (value.lineNumber > array[index - 1].lineNumber);
}

/**
 * Lints a string containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string} name Identifier for the content.
 * @param {string} content Markdown content.
 * @param {Object} md Instance of markdown-it.
 * @param {Configuration} config Configuration object.
 * @param {RegExp} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintContent(
  ruleList,
  name,
  content,
  md,
  config,
  frontMatter,
  handleRuleFailures,
  noInlineConfig,
  resultVersion,
  callback) {
  // Remove UTF-8 byte order marker (if present)
  content = content.replace(/^\uFEFF/, "");
  // Remove front matter
  const removeFrontMatterResult = removeFrontMatter(content, frontMatter);
  const frontMatterLines = removeFrontMatterResult.frontMatterLines;
  // Ignore the content of HTML comments
  content = helpers.clearHtmlCommentText(removeFrontMatterResult.content);
  // Parse content into tokens and lines
  const tokens = md.parse(content, {});
  const lines = content.split(helpers.newLineRe);
  annotateTokens(tokens, lines);
  const aliasToRuleNames = mapAliasToRuleNames(ruleList);
  const { effectiveConfig, enabledRulesPerLineNumber } =
    getEnabledRulesPerLineNumber(
      ruleList,
      lines,
      frontMatterLines,
      noInlineConfig,
      config,
      aliasToRuleNames
    );
  // Create parameters for rules
  const params = {
    name,
    tokens,
    lines,
    frontMatterLines
  };
  cache.lineMetadata(helpers.getLineMetadata(params));
  cache.flattenedLists(helpers.flattenLists(params));
  // Function to run for each rule
  const result = (resultVersion === 0) ? {} : [];
  // eslint-disable-next-line jsdoc/require-jsdoc
  function forRule(rule) {
    // Configure rule
    const ruleNameFriendly = rule.names[0];
    const ruleName = ruleNameFriendly.toUpperCase();
    params.config = effectiveConfig[ruleName];
    // eslint-disable-next-line jsdoc/require-jsdoc
    function throwError(property) {
      throw new Error(
        "Property '" + property + "' of onError parameter is incorrect.");
    }
    const errors = [];
    // eslint-disable-next-line jsdoc/require-jsdoc
    function onError(errorInfo) {
      if (!errorInfo ||
        !helpers.isNumber(errorInfo.lineNumber) ||
        (errorInfo.lineNumber < 1) ||
        (errorInfo.lineNumber > lines.length)) {
        throwError("lineNumber");
      }
      if (errorInfo.detail &&
        !helpers.isString(errorInfo.detail)) {
        throwError("detail");
      }
      if (errorInfo.context &&
        !helpers.isString(errorInfo.context)) {
        throwError("context");
      }
      if (errorInfo.range &&
        (!Array.isArray(errorInfo.range) ||
         (errorInfo.range.length !== 2) ||
         !helpers.isNumber(errorInfo.range[0]) ||
         (errorInfo.range[0] < 1) ||
         !helpers.isNumber(errorInfo.range[1]) ||
         (errorInfo.range[1] < 1) ||
         ((errorInfo.range[0] + errorInfo.range[1] - 1) >
          lines[errorInfo.lineNumber - 1].length))) {
        throwError("range");
      }
      const fixInfo = errorInfo.fixInfo;
      const cleanFixInfo = {};
      if (fixInfo) {
        if (!helpers.isObject(fixInfo)) {
          throwError("fixInfo");
        }
        if (fixInfo.lineNumber !== undefined) {
          if ((!helpers.isNumber(fixInfo.lineNumber) ||
            (fixInfo.lineNumber < 1) ||
            (fixInfo.lineNumber > lines.length))) {
            throwError("fixInfo.lineNumber");
          }
          cleanFixInfo.lineNumber =
            fixInfo.lineNumber + frontMatterLines.length;
        }
        const effectiveLineNumber = fixInfo.lineNumber || errorInfo.lineNumber;
        if (fixInfo.editColumn !== undefined) {
          if ((!helpers.isNumber(fixInfo.editColumn) ||
            (fixInfo.editColumn < 1) ||
            (fixInfo.editColumn >
              lines[effectiveLineNumber - 1].length + 1))) {
            throwError("fixInfo.editColumn");
          }
          cleanFixInfo.editColumn = fixInfo.editColumn;
        }
        if (fixInfo.deleteCount !== undefined) {
          if ((!helpers.isNumber(fixInfo.deleteCount) ||
            (fixInfo.deleteCount < -1) ||
            (fixInfo.deleteCount >
              lines[effectiveLineNumber - 1].length))) {
            throwError("fixInfo.deleteCount");
          }
          cleanFixInfo.deleteCount = fixInfo.deleteCount;
        }
        if (fixInfo.insertText !== undefined) {
          if (!helpers.isString(fixInfo.insertText)) {
            throwError("fixInfo.insertText");
          }
          cleanFixInfo.insertText = fixInfo.insertText;
        }
      }
      errors.push({
        "lineNumber": errorInfo.lineNumber + frontMatterLines.length,
        "detail": errorInfo.detail || null,
        "context": errorInfo.context || null,
        "range": errorInfo.range ? [ ...errorInfo.range ] : null,
        "fixInfo": fixInfo ? cleanFixInfo : null
      });
    }
    // Call (possibly external) rule function
    if (handleRuleFailures) {
      try {
        rule.function(params, onError);
      } catch (error) {
        onError({
          "lineNumber": 1,
          "detail": `This rule threw an exception: ${error.message}`
        });
      }
    } else {
      rule.function(params, onError);
    }
    // Record any errors (significant performance benefit from length check)
    if (errors.length > 0) {
      errors.sort(lineNumberComparison);
      const filteredErrors = errors
        .filter((resultVersion === 3) ?
          filterAllValues :
          uniqueFilterForSortedErrors)
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
          errorObject.ruleInformation =
            rule.information ? rule.information.href : null;
          errorObject.errorDetail = error.detail;
          errorObject.errorContext = error.context;
          errorObject.errorRange = error.range;
          if (resultVersion === 3) {
            errorObject.fixInfo = error.fixInfo;
          }
          return errorObject;
        });
      if (filteredErrors.length > 0) {
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
  } catch (error) {
    cache.clear();
    return callback(error);
  }
  cache.clear();
  return callback(null, result);
}

/**
 * Lints a file containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string} file Path of file to lint.
 * @param {Object} md Instance of markdown-it.
 * @param {Configuration} config Configuration object.
 * @param {RegExp} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintFile(
  ruleList,
  file,
  md,
  config,
  frontMatter,
  handleRuleFailures,
  noInlineConfig,
  resultVersion,
  synchronous,
  callback) {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintContentWrapper(err, content) {
    if (err) {
      return callback(err);
    }
    return lintContent(ruleList, file, content, md, config, frontMatter,
      handleRuleFailures, noInlineConfig, resultVersion, callback);
  }
  // Make a/synchronous call to read file
  if (synchronous) {
    // @ts-ignore
    lintContentWrapper(null, fs.readFileSync(file, helpers.utf8Encoding));
  } else {
    fs.readFile(file, helpers.utf8Encoding, lintContentWrapper);
  }
}

/**
 * Lint files and strings specified in the Options object.
 *
 * @param {Options} options Options object.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintInput(options, synchronous, callback) {
  // Normalize inputs
  options = options || {};
  callback = callback || function noop() {};
  // eslint-disable-next-line unicorn/prefer-spread
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
    helpers.frontMatterRe : options.frontMatter;
  const handleRuleFailures = !!options.handleRuleFailures;
  const noInlineConfig = !!options.noInlineConfig;
  const resultVersion = (options.resultVersion === undefined) ?
    2 : options.resultVersion;
  const md = markdownIt({ "html": true });
  const markdownItPlugins = options.markdownItPlugins || [];
  markdownItPlugins.forEach(function forPlugin(plugin) {
    // @ts-ignore
    md.use(...plugin);
  });
  const results = newResults(ruleList);
  let done = false;
  // Linting of strings is always synchronous
  let syncItem = null;
  // eslint-disable-next-line jsdoc/require-jsdoc
  function syncCallback(err, result) {
    if (err) {
      done = true;
      return callback(err);
    }
    results[syncItem] = result;
    return null;
  }
  while (!done && (syncItem = stringsKeys.shift())) {
    lintContent(
      ruleList,
      syncItem,
      strings[syncItem] || "",
      md,
      config,
      frontMatter,
      handleRuleFailures,
      noInlineConfig,
      resultVersion,
      syncCallback
    );
  }
  if (synchronous) {
    // Lint files synchronously
    while (!done && (syncItem = files.shift())) {
      lintFile(
        ruleList,
        syncItem,
        md,
        config,
        frontMatter,
        handleRuleFailures,
        noInlineConfig,
        resultVersion,
        synchronous,
        syncCallback
      );
    }
    return done || callback(null, results);
  }
  // Lint files asynchronously
  let concurrency = 0;
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintConcurrently() {
    const asyncItem = files.shift();
    if (done) {
      // Nothing to do
    } else if (asyncItem) {
      concurrency++;
      lintFile(
        ruleList,
        asyncItem,
        md,
        config,
        frontMatter,
        handleRuleFailures,
        noInlineConfig,
        resultVersion,
        synchronous,
        (err, result) => {
          concurrency--;
          if (err) {
            done = true;
            return callback(err);
          }
          results[asyncItem] = result;
          lintConcurrently();
          return null;
        }
      );
    } else if (concurrency === 0) {
      done = true;
      return callback(null, results);
    }
    return null;
  }
  // Testing on a Raspberry Pi 4 Model B with an artificial 5ms file access
  // delay suggests that a concurrency factor of 8 can eliminate the impact
  // of that delay (i.e., total time is the same as with no delay).
  lintConcurrently();
  lintConcurrently();
  lintConcurrently();
  lintConcurrently();
  lintConcurrently();
  lintConcurrently();
  lintConcurrently();
  lintConcurrently();
  return null;
}

/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function markdownlint(options, callback) {
  return lintInput(options, false, callback);
}

const markdownlintPromisify = promisify && promisify(markdownlint);

/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
function markdownlintPromise(options) {
  return markdownlintPromisify(options);
}

/**
 * Lint specified Markdown files synchronously.
 *
 * @param {Options} options Configuration options.
 * @returns {LintResults} Results object.
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

/**
 * Parse the content of a configuration file.
 *
 * @param {string} name Name of the configuration file.
 * @param {string} content Configuration content.
 * @param {ConfigurationParser[]} parsers Parsing function(s).
 * @returns {Object} Configuration object and error message.
 */
function parseConfiguration(name, content, parsers) {
  let config = null;
  let message = "";
  const errors = [];
  // Try each parser
  (parsers || [ JSON.parse ]).every((parser) => {
    try {
      config = parser(content);
    } catch (error) {
      errors.push(error.message);
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
 * Resolve referenced "extends" path in a configuration file
 * using path.resolve() with require.resolve() as a fallback.
 *
 * @param {string} configFile Configuration file name.
 * @param {string} referenceId Referenced identifier to resolve.
 * @returns {string} Resolved path to file.
 */
function resolveConfigExtends(configFile, referenceId) {
  const configFileDirname = path.dirname(configFile);
  const resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
  try {
    if (fs.statSync(resolvedExtendsFile).isFile()) {
      return resolvedExtendsFile;
    }
  } catch {
    // If not a file or fs.statSync throws, try require.resolve
  }
  try {
    return dynamicRequire.resolve(
      referenceId,
      { "paths": [ configFileDirname ] }
    );
  } catch {
    // If require.resolve throws, return resolvedExtendsFile
  }
  return resolvedExtendsFile;
}

/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} parsers Parsing
 * function(s).
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
function readConfig(file, parsers, callback) {
  if (!callback) {
    // @ts-ignore
    callback = parsers;
    parsers = null;
  }
  // Read file
  fs.readFile(file, helpers.utf8Encoding, (err, content) => {
    if (err) {
      return callback(err);
    }
    // Try to parse file
    // @ts-ignore
    const { config, message } = parseConfiguration(file, content, parsers);
    if (!config) {
      return callback(new Error(message));
    }
    // Extend configuration
    const configExtends = config.extends;
    if (configExtends) {
      delete config.extends;
      const resolvedExtends = resolveConfigExtends(file, configExtends);
      return readConfig(resolvedExtends, parsers, (errr, extendsConfig) => {
        if (errr) {
          return callback(errr);
        }
        return callback(null, {
          ...extendsConfig,
          ...config
        });
      });
    }
    return callback(null, config);
  });
}

const readConfigPromisify = promisify && promisify(readConfig);

/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Promise<Configuration>} Configuration object.
 */
function readConfigPromise(file, parsers) {
  // @ts-ignore
  return readConfigPromisify(file, parsers);
}

/**
 * Read specified configuration file synchronously.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Configuration} Configuration object.
 */
function readConfigSync(file, parsers) {
  // Read file
  // @ts-ignore
  const content = fs.readFileSync(file, helpers.utf8Encoding);
  // Try to parse file
  const { config, message } = parseConfiguration(file, content, parsers);
  if (!config) {
    throw new Error(message);
  }
  // Extend configuration
  const configExtends = config.extends;
  if (configExtends) {
    delete config.extends;
    const resolvedExtends = resolveConfigExtends(file, configExtends);
    return {
      ...readConfigSync(resolvedExtends, parsers),
      ...config
    };
  }
  return config;
}

/**
 * Gets the (semantic) version of the library.
 *
 * @returns {string} SemVer string.
 */
function getVersion() {
  return require("../package.json").version;
}

// Export a/synchronous/Promise APIs
markdownlint.sync = markdownlintSync;
markdownlint.readConfig = readConfig;
markdownlint.readConfigSync = readConfigSync;
markdownlint.getVersion = getVersion;
markdownlint.promises = {
  "markdownlint": markdownlintPromise,
  "readConfig": readConfigPromise
};
module.exports = markdownlint;

// Type declarations

/**
 * Function to implement rule logic.
 *
 * @callback RuleFunction
 * @param {RuleParams} params Rule parameters.
 * @param {RuleOnError} onError Error-reporting callback.
 * @returns {void}
 */

/**
 * Rule parameters.
 *
 * @typedef {Object} RuleParams
 * @property {string} name File/string name.
 * @property {MarkdownItToken[]} tokens Token objects from markdown-it.
 * @property {string[]} lines File/string lines.
 * @property {string[]} frontMatterLines Front matter lines.
 * @property {RuleConfiguration} config Rule configuration.
 */

/**
 * Markdown-It token.
 *
 * @typedef {Object} MarkdownItToken
 * @property {string[][]} attrs HTML attributes.
 * @property {boolean} block Block-level token.
 * @property {MarkdownItToken[]} children Child nodes.
 * @property {string} content Tag contents.
 * @property {boolean} hidden Ignore element.
 * @property {string} info Fence info.
 * @property {number} level Nesting level.
 * @property {number[]} map Beginning/ending line numbers.
 * @property {string} markup Markup text.
 * @property {Object} meta Arbitrary data.
 * @property {number} nesting Level change.
 * @property {string} tag HTML tag name.
 * @property {string} type Token type.
 * @property {number} lineNumber Line number (1-based).
 * @property {string} line Line content.
 */

/**
 * Error-reporting callback.
 *
 * @callback RuleOnError
 * @param {RuleOnErrorInfo} onErrorInfo Error information.
 * @returns {void}
 */

/**
 * Fix information for RuleOnError callback.
 *
 * @typedef {Object} RuleOnErrorInfo
 * @property {number} lineNumber Line number (1-based).
 * @property {string} [details] Details about the error.
 * @property {string} [context] Context for the error.
 * @property {number[]} [range] Column number (1-based) and length.
 * @property {RuleOnErrorFixInfo} [fixInfo] Fix information.
 */

/**
 * Fix information for RuleOnErrorInfo.
 *
 * @typedef {Object} RuleOnErrorFixInfo
 * @property {number} [lineNumber] Line number (1-based).
 * @property {number} [editColumn] Column of the fix (1-based).
 * @property {number} [deleteCount] Count of characters to delete.
 * @property {string} [insertText] Text to insert (after deleting).
 */

/**
 * Rule definition.
 *
 * @typedef {Object} Rule
 * @property {string[]} names Rule name(s).
 * @property {string} description Rule description.
 * @property {URL} [information] Link to more information.
 * @property {string[]} tags Rule tag(s).
 * @property {RuleFunction} function Rule implementation.
 */

/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {string[] | string} [files] Files to lint.
 * @property {Object.<string, string>} [strings] Strings to lint.
 * @property {Configuration} [config] Configuration object.
 * @property {Rule[] | Rule} [customRules] Custom rules.
 * @property {RegExp} [frontMatter] Front matter pattern.
 * @property {boolean} [handleRuleFailures] True to catch exceptions.
 * @property {boolean} [noInlineConfig] True to ignore HTML directives.
 * @property {number} [resultVersion] Results object version.
 * @property {Plugin[]} [markdownItPlugins] Additional plugins.
 */

/**
 * A markdown-it plugin.
 *
 * @typedef {Array} Plugin
 */

/**
 * Function to pretty-print lint results.
 *
 * @callback ToStringCallback
 * @param {boolean} [ruleAliases] True to use rule aliases.
 * @returns {string}
 */

/**
 * Lint results (for resultVersion 3).
 *
 * @typedef {Object.<string, LintError[]>} LintResults
 * @property {ToStringCallback} toString String representation.
 */

/**
 * Lint error.
 *
 * @typedef {Object} LintError
 * @property {number} lineNumber Line number (1-based).
 * @property {string[]} ruleNames Rule name(s).
 * @property {string} ruleDescription Rule description.
 * @property {string} ruleInformation Link to more information.
 * @property {string} errorDetail Detail about the error.
 * @property {string} errorContext Context for the error.
 * @property {number[]} errorRange Column number (1-based) and length.
 * @property {FixInfo} [fixInfo] Fix information.
 */

/**
 * Fix information.
 *
 * @typedef {Object} FixInfo
 * @property {number} [editColumn] Column of the fix (1-based).
 * @property {number} [deleteCount] Count of characters to delete.
 * @property {string} [insertText] Text to insert (after deleting).
 */

/**
 * Called with the result of the lint operation.
 *
 * @callback LintCallback
 * @param {Error | null} err Error object or null.
 * @param {LintResults} [results] Lint results.
 * @returns {void}
 */

/**
 * Configuration object for linting rules. For a detailed schema, see
 * {@link ../schema/markdownlint-config-schema.json}.
 *
 * @typedef {Object.<string, RuleConfiguration>} Configuration
 */

/**
 * Rule configuration object.
 *
 * @typedef {boolean | Object} RuleConfiguration Rule configuration.
 */

/**
 * Parses a configuration string and returns a configuration object.
 *
 * @callback ConfigurationParser
 * @param {string} text Configuration string.
 * @returns {Configuration}
 */

/**
 * Called with the result of the readConfig operation.
 *
 * @callback ReadConfigCallback
 * @param {Error | null} err Error object or null.
 * @param {Configuration} [config] Configuration object.
 * @returns {void}
 */

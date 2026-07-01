// @ts-check

import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import path from "node:path";
import test from "node:test";
import Ajv from "ajv";
import { globby } from "globby";
import jsoncParser from "jsonc-parser";
import { load as yamlLoad } from "js-yaml";
import markdownIt from "markdown-it";
import pluginInline from "markdown-it-for-inline";
import pluginSub from "markdown-it-sub";
import pluginSup from "markdown-it-sup";
import { getVersion } from "markdownlint";
import { lint as lintAsync } from "markdownlint/async";
import { lint as lintPromise } from "markdownlint/promise";
import { lint as lintSync } from "markdownlint/sync";
import { convertToResultVersion0 } from "markdownlint/helpers";
import * as cache from "../lib/cache.mjs";
import * as constants from "../lib/constants.mjs";
import rules from "../lib/rules.mjs";
import customRules from "./rules/rules.cjs";
/** @type {{exports: Object.<string, string>, homepage: string, version: string}} */
import packageJson from "../package.json" with { "type": "json" };
/** @type {{$id: string, properties: Object<string, Object>}} */
import configSchema from "../schema/markdownlint-config-schema.json" with { "type": "json" };
import configSchemaStrict from "../schema/markdownlint-config-schema-strict.json" with { "type": "json" };

const deprecatedRuleNames = new Set(constants.deprecatedRuleNames);
const ajvOptions = {
  "allowUnionTypes": true
};

/** @typedef {import("node:test").TestFn} TestFn */
/** @typedef {import("markdownlint").Configuration} Configuration */
/** @typedef {import("markdownlint").LintResults} LintResults */

/**
 * Gets an instance of a markdown-it factory, suitable for use with options.markdownItFactory.
 *
 * @param {import("../lib/markdownlint.mjs").Plugin[]} markdownItPlugins Additional markdown-it plugins.
 * @returns {import("../lib/markdownlint.mjs").MarkdownItFactory} Function to create a markdown-it parser.
 */
function getMarkdownItFactory(markdownItPlugins) {
  return () => {
    const md = markdownIt({ "html": true });
    for (const markdownItPlugin of markdownItPlugins) {
      // @ts-ignore
      md.use(...markdownItPlugin);
    }
    return md;
  };
}

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  test("simpleAsync", (t) => new Promise((resolve) => {
    t.plan(3);
    const options = {
      "strings": {
        "content": "# Heading"
      }
    };
    lintAsync(options, (err, actual) => {
      t.assert.equal(err, null);
      t.assert.equal(actual?.content.length, 1);
      t.assert.equal(actual?.content[0].ruleNames[0], "MD047");
      resolve();
    });
  }));

  test("simpleSync", (t) => {
    t.plan(2);
    const options = {
      "strings": {
        "content": "# Heading"
      }
    };
    const actual = lintSync(options);
    t.assert.equal(actual.content.length, 1);
    t.assert.equal(actual.content[0].ruleNames[0], "MD047");
  });

  test("simplePromise", (t) => {
    t.plan(2);
    const options = {
      "strings": {
        "content": "# Heading"
      }
    };
    return lintPromise(options).then((actual) => {
      t.assert.equal(actual.content.length, 1);
      t.assert.equal(actual.content[0].ruleNames[0], "MD047");
    });
  });

  test("stringInputLineEndings", (t) => new Promise((resolve) => {
    t.plan(2);
    const options = {
      "strings": {
        "cr": "One\rTwo\r#Three\n",
        "lf": "One\nTwo\n#Three\n",
        "crlf": "One\r\nTwo\r\n#Three\n",
        "mixed": "One\rTwo\n#Three\n"
      },
      "config": {
        "MD041": false
      }
    };
    lintAsync(options, function callback(err, actualResult) {
      t.assert.equal(err, null);
      const expectedResult = {
        "cr": { "MD018": [ 3 ] },
        "lf": { "MD018": [ 3 ] },
        "crlf": { "MD018": [ 3 ] },
        "mixed": { "MD018": [ 3 ] }
      };
      t.assert.deepEqual(convertToResultVersion0(actualResult || {}), expectedResult);
      resolve();
    });
  }));

  test("inputOnlyNewline", (t) => new Promise((resolve) => {
    t.plan(2);
    const options = {
      "strings": {
        "cr": "\r",
        "lf": "\n",
        "crlf": "\r\n"
      },
      "config": {
        "default": false
      }
    };
    lintAsync(options, function callback(err, actualResult) {
      t.assert.equal(err, null);
      const expectedResult = {
        "cr": [],
        "lf": [],
        "crlf": []
      };
      t.assert.deepEqual(actualResult, expectedResult);
      resolve();
    });
  }));

  /** @typedef {Object<string, string[]>} NormalizedLintResults */

  /**
   * Normalizes LintResults.
   *
   * @param {LintResults} results LintResults.
   * @returns {NormalizedLintResults} Normalized LintResults.
   */
  function normalizeLintResults(results) {
    return Object.fromEntries(
      Object.entries(results).map(
        ([ source, errors ]) => [
          source,
          errors.map(
            ({ lineNumber, ruleNames, severity }) => `${ruleNames[0]} ${lineNumber} ${severity}`
          )
        ]
      )
    );
  }

  /**
   * Gets a Configuration value test implementation.
   *
   * @param {Configuration} config Configuration object.
   * @param {NormalizedLintResults} expected Expected result.
   * @returns {TestFn} Test implementation.
   */
  function getConfigTestImplementation(config, expected) {
    return async(t) => {
      t.plan(1);
      const options = {
        config,
        "files": [
          "./test/atx_heading_spacing.md",
          "./test/first_heading_bad_atx.md"
        ],
        "noInlineConfig": true
      };
      const actual = await lintPromise(options);
      t.assert.deepEqual(normalizeLintResults(actual), expected);
    };
  }

  /**
   * Converts a config test scenario from errors to warnings.
   *
   * @param {Object.<string, string[]>} configTest Config test scenario.
   * @returns {Object.<string, string[]>} Converted scenario.
   */
  function configTestAsWarnings(configTest) {
    return JSON.parse(JSON.stringify(configTest).replaceAll("error", "warning"));
  }

  const configTestExpected = {
    "./test/atx_heading_spacing.md": [],
    "./test/first_heading_bad_atx.md": []
  };
  const configTestExpected1 = {
    "./test/atx_heading_spacing.md": [
      "MD018 1 error"
    ],
    "./test/first_heading_bad_atx.md": []
  };
  const configTestExpected11 = {
    "./test/atx_heading_spacing.md": [
      "MD041 1 error"
    ],
    "./test/first_heading_bad_atx.md": [
      "MD041 1 error"
    ]
  };
  const configTestExpected135 = {
    "./test/atx_heading_spacing.md": [
      "MD018 1 error",
      "MD019 3 error",
      "MD019 5 error"
    ],
    "./test/first_heading_bad_atx.md": []
  };
  const configTestExpected3511 = {
    "./test/atx_heading_spacing.md": [
      "MD019 3 error",
      "MD019 5 error",
      "MD041 1 error"
    ],
    "./test/first_heading_bad_atx.md": [
      "MD041 1 error"
    ]
  };
  const configTestExpected13511 = {
    "./test/atx_heading_spacing.md": [
      "MD018 1 error",
      "MD019 3 error",
      "MD019 5 error",
      "MD041 1 error"
    ],
    "./test/first_heading_bad_atx.md": [
      "MD041 1 error"
    ]
  };

  test("defaultUnset", getConfigTestImplementation(
    {},
    configTestExpected13511
  ));

  test("defaultTrue", getConfigTestImplementation(
    { "default": true },
    configTestExpected13511
  ));

  test("defaultFalse", getConfigTestImplementation(
    { "default": false },
    configTestExpected
  ));

  test("defaultTruthy", getConfigTestImplementation(
    // @ts-ignore
    { "default": 1 },
    configTestExpected13511
  ));

  test("defaultFalsy", getConfigTestImplementation(
    // @ts-ignore
    { "default": 0 },
    configTestExpected
  ));

  test("defaultError", getConfigTestImplementation(
    { "default": "error" },
    configTestExpected13511
  ));

  test("defaultWarning", getConfigTestImplementation(
    // @ts-ignore
    { "default": "warning" },
    configTestAsWarnings(configTestExpected13511)
  ));

  test("defaultMultipleTrue", getConfigTestImplementation(
    {
      "default": true,
      "DEFAULT": false
    },
    configTestExpected13511
  ));

  test("defaultMultipleFalse", getConfigTestImplementation(
    {
      "DEFAULT": false,
      "default": true
    },
    configTestExpected
  ));

  test("disableRules", getConfigTestImplementation(
    {
      "default": true,
      "MD019": false,
      "first-line-h1": false,
      "extra": false
    },
    configTestExpected1
  ));

  test("disableRulesFalsy", getConfigTestImplementation(
    {
      "default": true,
      // @ts-ignore
      "MD019": 0,
      // @ts-ignore
      "first-line-h1": 0,
      "extra": 0
    },
    configTestExpected1
  ));

  test("enableRules", getConfigTestImplementation(
    {
      "MD041": true,
      "default": false,
      "no-multiple-space-atx": true,
      "extra": true
    },
    configTestExpected3511
  ));

  test("enableRulesMixedCase", getConfigTestImplementation(
    {
      "Md041": true,
      "DeFaUlT": false,
      "nO-mUlTiPlE-sPaCe-AtX": true,
      "ExTrA": true
    },
    configTestExpected3511
  ));

  test("enableRulesTruthy", getConfigTestImplementation(
    {
      // @ts-ignore
      "MD041": 1,
      "default": false,
      // @ts-ignore
      "no-multiple-space-atx": 1,
      "extra": 1
    },
    configTestExpected3511
  ));

  test("enableRulesError", getConfigTestImplementation(
    {
      "MD041": "error",
      "default": false,
      "no-multiple-space-atx": "error",
      "extra": "error"
    },
    configTestExpected3511
  ));

  test("enableRulesWarning", getConfigTestImplementation(
    {
      "MD041": "warning",
      "default": false,
      "no-multiple-space-atx": "warning",
      "extra": "warning"
    },
    configTestAsWarnings(configTestExpected3511)
  ));

  test("enableRulesObjectEmpty", getConfigTestImplementation(
    {
      "MD041": {},
      "default": false,
      "no-multiple-space-atx": {},
      "extra": {}
    },
    configTestExpected3511
  ));

  test("enableRulesObjectSeverityTruthy", getConfigTestImplementation(
    {
      "MD041": {
        // @ts-ignore
        "severity": 1
      },
      "default": false,
      "no-multiple-space-atx": {
        // @ts-ignore
        "severity": 1
      },
      "extra": {
        "severity": 1
      }
    },
    configTestExpected3511
  ));

  test("enableRulesObjectSeverityFalsy", getConfigTestImplementation(
    {
      "MD041": {
        // @ts-ignore
        "severity": 0
      },
      "default": false,
      "no-multiple-space-atx": {
        // @ts-ignore
        "severity": 0
      },
      "extra": {
        "severity": 0
      }
    },
    configTestExpected3511
  ));

  test("enableRulesObjectSeverityError", getConfigTestImplementation(
    {
      "MD041": {
        "severity": "error"
      },
      "default": false,
      "no-multiple-space-atx": {
        "severity": "error"
      },
      "extra": {
        "severity": "error"
      }
    },
    configTestExpected3511
  ));

  test("enableRulesObjectSeverityWarning", getConfigTestImplementation(
    {
      "MD041": {
        "severity": "warning"
      },
      "default": false,
      "no-multiple-space-atx": {
        "severity": "warning"
      },
      "extra": {
        "severity": "warning"
      }
    },
    configTestAsWarnings(configTestExpected3511)
  ));

  test("enableRulesObjectEnabledTrue", getConfigTestImplementation(
    {
      "MD041": {
        "enabled": true
      },
      "default": false,
      "no-multiple-space-atx": {
        "enabled": true
      },
      "extra": {
        "enabled": true
      }
    },
    configTestExpected3511
  ));

  test("enableRulesObjectEnabledFalse", getConfigTestImplementation(
    {
      "MD041": {
        "enabled": false
      },
      "default": true,
      "no-multiple-space-atx": {
        "enabled": false
      },
      "extra": {
        "enabled": false
      }
    },
    configTestExpected1
  ));

  test("enableRulesObjectEnabledTruthy", getConfigTestImplementation(
    {
      "MD041": {
        // @ts-ignore
        "enabled": 1
      },
      "default": false,
      "no-multiple-space-atx": {
        // @ts-ignore
        "enabled": 1
      },
      "extra": {
        "enabled": 1
      }
    },
    configTestExpected3511
  ));

  test("enableRulesObjectEnabledFalsy", getConfigTestImplementation(
    {
      "MD041": {
        // @ts-ignore
        "enabled": 0
      },
      "default": true,
      "no-multiple-space-atx": {
        // @ts-ignore
        "enabled": 0
      },
      "extra": {
        "enabled": 0
      }
    },
    configTestExpected1
  ));

  test("disableTag", getConfigTestImplementation(
    {
      "default": true,
      "spaces": false,
      "extra": false
    },
    configTestExpected11
  ));

  test("disableTagFalsy", getConfigTestImplementation(
    {
      "default": true,
      // @ts-ignore
      "spaces": 0,
      "extra": 0
    },
    configTestExpected11
  ));

  test("enableTag", getConfigTestImplementation(
    {
      "default": false,
      "spaces": true,
      "extra": true
    },
    configTestExpected135
  ));

  test("enableTagMixedCase", getConfigTestImplementation(
    {
      "DeFaUlT": false,
      "SpAcEs": true,
      "ExTrA": true
    },
    configTestExpected135
  ));

  test("enableTagTruthy", getConfigTestImplementation(
    {
      "default": false,
      // @ts-ignore
      "spaces": 1,
      "extra": 1
    },
    configTestExpected135
  ));

  test("enableTagError", getConfigTestImplementation(
    {
      "default": false,
      "spaces": "error",
      "extra": "error"
    },
    configTestExpected135
  ));

  test("enableTagWarning", getConfigTestImplementation(
    {
      "default": false,
      "spaces": "warning",
      "extra": "warning"
    },
    configTestAsWarnings(configTestExpected135)
  ));

  test("styleFiles", async(t) => {
    t.plan(8);
    const files = await fs.promises.readdir("./style");
    for (const file of files) {
      t.assert.equal(!!require(path.join("../style", file)), true, "Unable to load/parse.");
      const exportValue = `./style/${file}`;
      const exportKey = exportValue.replace(/\.json$/, "");
      // @ts-ignore
      t.assert.equal(packageJson.exports[exportKey], exportValue);
    }
  });

  test("styleAll", async(t) => {
    t.plan(1);
    const options = {
      "files": [ "./test/break-all-the-rules.md" ],
      "config": require("../style/all.json"),
      "noInlineConfig": true
    };
    const actualResult = await lintPromise(options);
    const expectedResult = {
      "./test/break-all-the-rules.md": {
        "MD001": [ 3 ],
        "MD003": [ 5, 31 ],
        "MD004": [ 8 ],
        "MD005": [ 12 ],
        "MD007": [ 8, 11 ],
        "MD009": [ 14 ],
        "MD010": [ 14 ],
        "MD011": [ 16 ],
        "MD012": [ 18 ],
        "MD013": [ 21 ],
        "MD014": [ 23 ],
        "MD018": [ 25 ],
        "MD019": [ 27 ],
        "MD020": [ 29 ],
        "MD021": [ 31 ],
        "MD022": [ 86 ],
        "MD023": [ 40 ],
        "MD024": [ 35 ],
        "MD026": [ 40 ],
        "MD027": [ 42 ],
        "MD028": [ 43 ],
        "MD029": [ 47 ],
        "MD030": [ 8 ],
        "MD031": [ 50 ],
        "MD032": [ 7, 8, 51 ],
        "MD033": [ 55 ],
        "MD034": [ 57 ],
        "MD035": [ 61 ],
        "MD036": [ 65 ],
        "MD037": [ 67 ],
        "MD038": [ 69 ],
        "MD039": [ 71 ],
        "MD040": [ 73 ],
        "MD041": [ 1 ],
        "MD042": [ 81 ],
        "MD045": [ 85 ],
        "MD046": [ 49, 73, 77 ],
        "MD047": [ 144 ],
        "MD048": [ 77 ],
        "MD049": [ 90 ],
        "MD050": [ 94 ],
        "MD051": [ 96 ],
        "MD052": [ 98 ],
        "MD053": [ 100 ],
        "MD055": [ 110 ],
        "MD056": [ 116 ],
        "MD058": [ 119, 121 ],
        "MD059": [ 124 ],
        "MD060": [ 110 ]
      }
    };
    t.assert.deepEqual(convertToResultVersion0(actualResult), expectedResult);
  });

  test("styleRelaxed", async(t) => {
    t.plan(1);
    const options = {
      "files": [ "./test/break-all-the-rules.md" ],
      "config": require("../style/relaxed.json"),
      "noInlineConfig": true
    };
    const actualResult = await lintPromise(options);
    const expectedResult = {
      "./test/break-all-the-rules.md": {
        "MD001": [ 3 ],
        "MD003": [ 5, 31 ],
        "MD004": [ 8 ],
        "MD005": [ 12 ],
        "MD011": [ 16 ],
        "MD014": [ 23 ],
        "MD018": [ 25 ],
        "MD019": [ 27 ],
        "MD020": [ 29 ],
        "MD021": [ 31 ],
        "MD022": [ 86 ],
        "MD023": [ 40 ],
        "MD024": [ 35 ],
        "MD026": [ 40 ],
        "MD029": [ 47 ],
        "MD031": [ 50 ],
        "MD032": [ 7, 8, 51 ],
        "MD035": [ 61 ],
        "MD036": [ 65 ],
        "MD042": [ 81 ],
        "MD045": [ 85 ],
        "MD046": [ 49, 73, 77 ],
        "MD047": [ 144 ],
        "MD048": [ 77 ],
        "MD049": [ 90 ],
        "MD050": [ 94 ],
        "MD051": [ 96 ],
        "MD052": [ 98 ],
        "MD053": [ 100 ],
        "MD055": [ 110 ],
        "MD056": [ 116 ],
        "MD058": [ 119, 121 ],
        "MD059": [ 124 ],
        "MD060": [ 110 ]
      }
    };
    t.assert.deepEqual(convertToResultVersion0(actualResult), expectedResult);
  });

  test("nullFrontMatter", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "strings": {
        "content": "---\n\t\n---\n# Heading\n"
      },
      "frontMatter": null,
      "config": {
        "default": false,
        "MD010": true
      }
    }, function callback(err, result) {
      t.assert.equal(err, null);
      const expectedResult = {
        "content": { "MD010": [ 2 ] }
      };
      t.assert.deepEqual(convertToResultVersion0(result || {}), expectedResult);
      resolve();
    });
  }));

  test("customFrontMatter", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "strings": {
        "content": "<head>\n\t\n</head>\n# Heading\n"
      },
      "frontMatter": /<head>[\s\S]*<\/head>/,
      "config": {
        "default": false,
        "MD010": true
      }
    }, function callback(err, result) {
      t.assert.equal(err, null);
      const expectedResult = {
        "content": []
      };
      t.assert.deepEqual(result, expectedResult, "Did not get empty results.");
      resolve();
    });
  }));

  test("noInlineConfig", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "strings": {
        "content": [
          "# Heading",
          "",
          "\tTab",
          "",
          "<!-- markdownlint-disable-->",
          "",
          "\tTab",
          "",
          "<!-- markdownlint-enable-->",
          "",
          "\tTab\n"
        ].join("\n")
      },
      "noInlineConfig": true
    }, function callback(err, result) {
      t.assert.equal(err, null);
      const expectedResult = {
        "content": {
          "MD010": [ 3, 7, 11 ]
        }
      };
      t.assert.deepEqual(convertToResultVersion0(result || {}), expectedResult);
      resolve();
    });
  }));

  test("readmeHeadings", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "files": "README.md",
      "noInlineConfig": true,
      "config": {
        "default": false,
        "MD013": {
          "line_length": 150
        },
        "MD043": {
          "headings": [
            "# markdownlint",
            "## Install",
            "## Overview",
            "### Related",
            "### References",
            "## Demonstration",
            "## Rules / Aliases",
            "### Custom Rules",
            "## Tags",
            "## Configuration",
            "## API",
            "### Linting",
            "#### options",
            "##### options.config",
            "##### options.configParsers",
            "##### options.customRules",
            "##### options.files",
            "##### options.frontMatter",
            "##### options.fs",
            "##### options.handleRuleFailures",
            "##### options.markdownItFactory",
            "##### options.noInlineConfig",
            "##### options.strings",
            "#### callback",
            "#### result",
            "### Config",
            "#### file",
            "#### parsers",
            "#### fs",
            "#### callback",
            "#### result",
            "### Fixing",
            "### Miscellaneous",
            "## Usage",
            "## Browser",
            "## Examples",
            "## Contributing",
            "## Releasing",
            "## History"
          ]
        }
      }
    }, function callback(err, result) {
      t.assert.equal(err, null);
      const expected = { "README.md": [] };
      t.assert.deepEqual(result, expected);
      resolve();
    });
  }));

  test("filesArrayNotModified", (t) => new Promise((resolve) => {
    t.plan(2);
    const files = [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ];
    const expectedFiles = [ ...files ];
    lintAsync({ "files": files }, function callback(err) {
      t.assert.equal(err, null);
      t.assert.deepEqual(files, expectedFiles, "Files modified.");
      resolve();
    });
  }));

  test("filesArrayAsString", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "files": "README.md",
      "noInlineConfig": true,
      "config": {
        "MD013": { "line_length": 150 },
        "MD024": false
      }
    }, function callback(err, actual) {
      t.assert.equal(err, null);
      const expected = { "README.md": [] };
      t.assert.deepEqual(actual, expected, "Unexpected issues.");
      resolve();
    });
  }));

  test("missingOptions", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync(null, function callback(err, result) {
      t.assert.equal(err, null);
      t.assert.deepEqual(
        result,
        {},
        "Did not get empty result for missing options."
      );
      resolve();
    });
  }));

  test("missingFilesAndStrings", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({}, function callback(err, result) {
      t.assert.equal(err, null);
      t.assert.deepEqual(result, {}, "Did not get empty result for missing files/strings.");
      resolve();
    });
  }));

  test("missingCallback", (t) => {
    t.plan(0);
    // @ts-ignore
    lintAsync();
  });

  test("badFile", (t) => new Promise((resolve) => {
    t.plan(3);
    lintAsync({
      "files": [ "./badFile" ]
    }, function callback(err, result) {
      t.assert.equal(err instanceof Error, true, "Error not instance of Error.");
      // @ts-ignore
      t.assert.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
      t.assert.equal(!result, true, "Got result for bad file.");
      resolve();
    });
  }));

  test("badFileSync", (t) => {
    t.plan(1);
    t.assert.throws(
      function badFileCall() {
        lintSync({
          "files": [ "./badFile" ]
        });
      },
      {
        "message": /ENOENT/
      },
      "Did not get correct exception for bad file."
    );
  });

  test("badFilePromise", (t) => new Promise((resolve) => {
    t.plan(2);
    lintPromise({
      "files": [ "./badFile" ]
    }).then(
      null,
      (error) => {
        t.assert.equal(error instanceof Error, true, "Error not instance of Error.");
        t.assert.equal(error.code, "ENOENT", "Error code for bad file not ENOENT.");
        resolve();
      }
    );
  }));

  test("missingStringValue", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "strings": {
        // @ts-ignore
        "undefined": undefined,
        // @ts-ignore
        "null": null,
        "empty": ""
      }
    }, function callback(err, result) {
      t.assert.equal(err, null);
      const expectedResult = {
        "undefined": [],
        "null": [],
        "empty": []
      };
      t.assert.deepEqual(result, expectedResult, "Did not get empty results.");
      resolve();
    });
  }));

  test("customFileSystemSync", (t) => {
    t.plan(2);
    const file = "/dir/file.md";
    const fsApi = {
      "access": () => { throw new Error("access"); },
      "accessSync": () => { throw new Error("accessSync"); },
      "readFile": () => { throw new Error("readFile"); },
      // @ts-ignore
      "readFileSync": (p) => {
        t.assert.equal(p, file);
        return "# Heading";
      }
    };
    const result = lintSync({
      "files": file,
      "fs": fsApi
    });
    t.assert.deepEqual(result[file].length, 1, "Did not report violations.");
  });

  test("customFileSystemAsync", (t) => new Promise((resolve) => {
    t.plan(3);
    const file = "/dir/file.md";
    const fsApi = {
      "access": () => { throw new Error("access"); },
      "accessSync": () => { throw new Error("accessSync"); },
      // @ts-ignore
      "readFile": (p, o, cb) => {
        t.assert.equal(p, file);
        cb(null, "# Heading");
      },
      "readFileSync": () => { throw new Error("readFileSync"); }
    };
    lintAsync({
      "files": file,
      "fs": fsApi
    }, function callback(err, result) {
      t.assert.equal(err, null);
      // @ts-ignore
      t.assert.deepEqual(result[file].length, 1, "Did not report violations.");
      resolve();
    });
  }));

  test("readme", async(t) => {
    t.plan(132);
    /** @type {Object.<string, string[]>} */
    const tagToRules = {};
    for (const rule of rules) {
      for (const tag of rule.tags) {
        const tagRules = tagToRules[tag] || [];
        tagRules.push(rule.names[0]);
        tagToRules[tag] = tagRules;
      }
    }
    const contents = await fs.promises.readFile("README.md", "utf8");
    const rulesLeft = [ ...rules ];
    let seenRelated = false;
    let seenReferences = false;
    let seenRules = false;
    let inRules = false;
    let seenTags = false;
    let inTags = false;
    // @ts-ignore
    for (const token of markdownIt().parse(contents, {})) {
      if (
        (token.type === "bullet_list_open") &&
        (token.level === 0)
      ) {
        if (!seenRelated) {
          seenRelated = true;
        } else if (!seenReferences) {
          seenReferences = true;
        } else if (!seenRules) {
          seenRules = true;
          inRules = true;
        } else if (!seenTags) {
          seenTags = true;
          inTags = true;
        }
      } else if (
        (token.type === "bullet_list_close") &&
        (token.level === 0)
      ) {
        inRules = false;
        inTags = false;
      } else if (token.type === "inline") {
        if (inRules) {
          const rule = rulesLeft.shift();
          t.assert.equal(!!rule, true,
            "Missing rule implementation for " + token.content + ".");
          if (rule) {
            const ruleName = rule.names[0];
            const ruleAliases = rule.names.slice(1);
            let expected = "**[" + ruleName + "](doc/" +
              ruleName.toLowerCase() + ".md)** *" +
              ruleAliases.join("/") + "* - " + rule.description;
            if (deprecatedRuleNames.has(ruleName)) {
              expected = "~~" + expected + "~~";
            }
            t.assert.equal(token.content, expected, "Rule mismatch.");
          }
        } else if (inTags) {
          const parts =
            token.content.replace(/[`*]/g, "").split(/ - |, |,\n/);
          const tag = parts.shift() || "";
          t.assert.deepEqual(parts, tagToRules[tag] || [],
            "Rule mismatch for tag " + tag + ".");
          delete tagToRules[tag];
        }
      }
    }
    const ruleLeft = rulesLeft.shift();
    t.assert.equal(!ruleLeft, true,
      "Missing rule documentation for " +
        (ruleLeft || "[NO RULE]").toString() + ".");
    const tagLeft = Object.keys(tagToRules).shift();
    t.assert.equal(!tagLeft, true, "Undocumented tag " + tagLeft + ".");
  });

  test("validateJsonUsingConfigSchemaStrict", async(t) => {
    t.plan(235);
    // @ts-ignore
    const ajv = new Ajv(ajvOptions);
    const validateSchemaStrict = ajv.compile(configSchemaStrict);
    const configRe =
      /^[\s\S]*<!-- markdownlint-configure-file ([\s\S]*) -->[\s\S]*$/;
    const ignoreFiles = new Set([
      "README.md",
      "test/inline-configure-file-invalid.md",
      "test/inline-configure-file-violations.md",
      "test/invalid-ul-style-style.md",
      "test/long-lines-negative-line-length.md",
      "test/wrong-types-in-config-file.md"
    ]);
    const files = await globby([
      "*.md",
      "doc/*.md",
      "helpers/*.md",
      "micromark/*.md",
      "schema/*.md",
      "test/*.md"
    ]);
    const testFiles = files.filter((file) => !ignoreFiles.has(file));
    for (const file of testFiles) {
      const data = fs.readFileSync(file, "utf8");
      if (configRe.test(data)) {
        const config = data.replace(configRe, "$1");
        const result = validateSchemaStrict(JSON.parse(config));
        t.assert.equal(
          !!result,
          true,
          `${file}\n${JSON.stringify(validateSchemaStrict.errors, null, 2)}`
        );
      }
    }
  });

  test("validateConfigSchemaAllowsUnknownProperties", (t) => {
    t.plan(4);
    // @ts-ignore
    const ajv = new Ajv(ajvOptions);
    const validateSchema = ajv.compile(configSchema);
    const validateSchemaStrict = ajv.compile(configSchemaStrict);
    const testCases = [
      {
        "property": true
      },
      {
        "property": {
          "object": 1
        }
      }
    ];
    for (const testCase of testCases) {
      const result = validateSchema(testCase);
      t.assert.equal(
        result,
        true,
        "Unknown property blocked by default: " + JSON.stringify(validateSchema.errors, null, 2)
      );
      const resultStrict = validateSchemaStrict(testCase);
      t.assert.equal(
        resultStrict,
        false,
        "Unknown property allowed when strict: " + JSON.stringify(validateSchemaStrict.errors, null, 2)
      );
    }
  });

  test("validateConfigSchemaAppliesToUnknownProperties", (t) => {
    t.plan(4);
    // @ts-ignore
    const ajv = new Ajv(ajvOptions);
    const validateSchema = ajv.compile(configSchema);
    for (const allowed of [ true, {} ]) {
      t.assert.equal(
        validateSchema({ "property": allowed }),
        true,
        `Unknown property value ${allowed} blocked`
      );
    }
    for (const blocked of [ 2, "string" ]) {
      t.assert.equal(
        validateSchema({ "property": blocked }),
        false,
        `Unknown property value ${blocked} allowed`
      );
    }
  });

  test("validateConfigExampleJson", (t) => {
    t.plan(4);

    // Validate schema
    // @ts-ignore
    const ajv = new Ajv(ajvOptions);
    const validateSchema = ajv.compile(configSchema);
    t.assert.equal(
      configSchema.$id.replace(/^.*\/v(?<ver>\d+\.\d+\.\d+)\/.*$/u, "$<ver>"),
      packageJson.version
    );
    // @ts-ignore
    t.assert.equal(configSchema.$id, configSchema.properties.$schema.default);

    // Validate JSONC
    const fileJson = ".markdownlint.jsonc";
    const dataJson = fs.readFileSync(
      path.join(import.meta.dirname, "../schema", fileJson),
      "utf8"
    );
    const jsonObject = jsoncParser.parse(dataJson);
    const result = validateSchema(jsonObject);
    t.assert.equal(
      result,
      true,
      `${fileJson}\n${JSON.stringify(validateSchema.errors, null, 2)}`
    );

    // Validate YAML
    const fileYaml = ".markdownlint.yaml";
    const dataYaml = fs.readFileSync(
      path.join(import.meta.dirname, "../schema", fileYaml),
      "utf8"
    );
    const yamlObject = yamlLoad(dataYaml);
    t.assert.deepEqual(yamlObject, jsonObject,
      "YAML example does not match JSON example.");
  });

  test("allBuiltInRulesHaveValidUrl", (t) => {
    t.plan(159);
    for (const rule of rules) {
      // @ts-ignore
      t.assert.equal(!!rule.information, true);
      // @ts-ignore
      t.assert.equal(Object.getPrototypeOf(rule.information, true) === URL.prototype, true);
      const ruleName = rule.names[0].toLowerCase();
      t.assert.equal(
        // @ts-ignore
        rule.information.href,
        `${packageJson.homepage}/blob/v${packageJson.version}/doc/${ruleName}.md`
      );
    }
  });

  test("someCustomRulesHaveValidUrl", (t) => {
    t.plan(9);
    for (const rule of customRules.all) {
      t.assert.equal(
        !rule.information || (Object.getPrototypeOf(rule.information) === URL.prototype),
        true);
      if (rule === customRules.anyBlockquote) {
        t.assert.equal(
          rule.information?.href,
          `${packageJson.homepage}/blob/main/test/rules/any-blockquote.js`
        );
      } else if (rule === customRules.lettersEX) {
        t.assert.equal(
          rule.information?.href,
          `${packageJson.homepage}/blob/main/test/rules/letters-E-X.js`
        );
      }
    }
  });

  test("coverageForCacheMicromarkTokensWhenUndefined", (t) => {
    t.plan(1);
    cache.initialize(undefined);
    t.assert.equal(cache.micromarkTokens().length, 0);
  });

  test("micromarkParseCalledWhenNeeded", (t) => new Promise((resolve) => {
    t.plan(3);
    /** @type {import("markdownlint").Rule} */
    const markdownItRule = {
      "names": [ "markdown-it-rule" ],
      "description": "markdown-it rule",
      "tags": [ "test" ],
      "parser": "markdownit",
      "function": () => {
        t.assert.equal(cache.micromarkTokens().length > 0, true);
      }
    };
    lintAsync({
      "strings": {
        "string": "# Heading\n\nText\n"
      },
      "config": {
        "markdown-it-rule": true
      },
      "customRules": [ markdownItRule ],
      "markdownItFactory": getMarkdownItFactory([])
    }, function callback(err, actual) {
      t.assert.equal(err, null);
      const expected = { "string": [] };
      t.assert.deepEqual(actual, expected, "Unexpected issues.");
      resolve();
    });
  }));

  test("micromarkParseSkippedWhenNotNeeded", (t) => new Promise((resolve) => {
    t.plan(3);
    /** @type {import("markdownlint").Rule} */
    const markdownItRule = {
      "names": [ "markdown-it-rule" ],
      "description": "markdown-it rule",
      "tags": [ "test" ],
      "parser": "markdownit",
      "function": () => {
        t.assert.equal(cache.micromarkTokens().length === 0, true);
      }
    };
    lintAsync({
      "strings": {
        "string": "# Heading\n\nText\n"
      },
      "config": {
        "default": false,
        "markdown-it-rule": true
      },
      "customRules": [ markdownItRule ],
      "markdownItFactory": getMarkdownItFactory([])
    }, function callback(err, actual) {
      t.assert.equal(err, null);
      const expected = { "string": [] };
      t.assert.deepEqual(actual, expected, "Unexpected issues.");
      resolve();
    });
  }));

  test("markdownItPluginsSingle", (t) => new Promise((resolve) => {
    t.plan(4);
    lintAsync({
      "strings": {
        "string": "# Heading\n\nText\n"
      },
      // Use a markdown-it custom rule so the markdown-it plugin will be run
      "customRules": customRules.anyBlockquote,
      "markdownItFactory": getMarkdownItFactory([
        [ pluginInline, "check_text_plugin", "text", () => t.assert.equal(true, true) ]
      ])
    }, function callback(err, actual) {
      t.assert.equal(err, null);
      const expected = { "string": [] };
      t.assert.deepEqual(actual, expected, "Unexpected issues.");
      resolve();
    });
  }));

  test("markdownItPluginsMultiple", (t) => new Promise((resolve) => {
    t.plan(4);
    lintAsync({
      "strings": {
        "string": "# Heading\n\nText H~2~0 text 29^th^ text\n"
      },
      // Use a markdown-it custom rule so the markdown-it plugin will be run
      "customRules": customRules.anyBlockquote,
      "markdownItFactory": getMarkdownItFactory([
        [ pluginSub ],
        [ pluginSup ],
        [ pluginInline, "check_sub_plugin", "sub_open", () => t.assert.equal(true, true) ],
        [ pluginInline, "check_sup_plugin", "sup_open", () => t.assert.equal(true, true) ]
      ])
    }, function callback(err, actual) {
      t.assert.equal(err, null);
      const expected = { "string": [] };
      t.assert.deepEqual(actual, expected, "Unexpected issues.");
      resolve();
    });
  }));

  test("markdownItPluginsNoMarkdownIt", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "strings": {
        "string": "# Heading\n\nText\n"
      },
      "markdownItFactory": getMarkdownItFactory([
        [ pluginInline, "check_text_plugin", "text", () => t.assert.fail() ]
      ])
    }, function callback(err, actual) {
      t.assert.equal(err, null);
      const expected = { "string": [] };
      t.assert.deepEqual(actual, expected, "Unexpected issues.");
      resolve();
    });
  }));

  test("markdownItPluginsUnusedUncalled", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "config": {
        "default": false
      },
      "strings": {
        "string": "# Heading\n\nText\n"
      },
      // Use a markdown-it custom rule so the markdown-it plugin will be run
      "customRules": customRules.anyBlockquote,
      "markdownItFactory": getMarkdownItFactory([
        [ pluginInline, "check_text_plugin", "text", () => t.assert.fail() ]
      ])
    }, function callback(err, actual) {
      t.assert.equal(err, null);
      const expected = { "string": [] };
      t.assert.deepEqual(actual, expected, "Unexpected issues.");
      resolve();
    });
  }));

  test("Pandoc footnote", (t) => new Promise((resolve) => {
    t.plan(2);
    lintAsync({
      "strings": {
        "string":
  `# Heading

  Text with: [^footnote]

  [^footnote]: Footnote text on multiple

      lines including a [reference][]

  [reference]: https://example.com
  `
      }
    }, (err, actual) => {
      t.assert.equal(err, null);
      const expected = { "string": [] };
      t.assert.deepEqual(actual, expected);
      resolve();
    });
  }));

  test("token-map-spans", (t) => {
    t.plan(38);
    /** @type {import("markdownlint").Options} */
    const options = {
      "customRules": [
        {
          "names": [ "token-map-spans" ],
          "description": "token-map-spans",
          "tags": [ "tms" ],
          "parser": "markdownit",
          "function": function tokenMapSpans(params) {
            /** @type {number[]} */
            const tokenLines = [];
            let lastLineNumber = -1;
            const inlines = params.parsers.markdownit.tokens.filter(
              (c) => c.type === "inline"
            );
            for (const token of inlines) {
              t.assert.equal(!!token.map, true);
              if (token.map) {
                for (let i = token.map[0]; i < token.map[1]; i++) {
                  if (tokenLines.includes(i)) {
                    t.assert.equal(
                      lastLineNumber === token.lineNumber,
                      true,
                      `Line ${i + 1} is part of token maps from multiple lines.`
                    );
                  } else {
                    tokenLines.push(i);
                  }
                  lastLineNumber = token.lineNumber;
                }
              }
            }
          }
        }
      ],
      "files": [ "./test/token-map-spans.md" ],
      "markdownItFactory": getMarkdownItFactory([])
    };
    lintSync(options);
  });

  test("configParsersInvalid", async(t) => {
    t.plan(2);
    const options = {
      "strings": {
        "content": [
          "Text",
          "",
          "<!-- markdownlint-configure-file",
          "  \"first-line-heading\": false",
          "-->",
          ""
        ].join("\n")
      }
    };
    const actual = await lintPromise(options);
    t.assert.equal(actual.content.length, 1);
    t.assert.equal(actual.content[0].ruleNames[0], "MD041");
  });

  test("configParsersJSON", async(t) => {
    t.plan(1);
    const options = {
      "strings": {
        "content": [
          "Text",
          "",
          "<!-- markdownlint-configure-file",
          "{",
          "  \"first-line-heading\": false",
          "}",
          "-->",
          ""
        ].join("\n")
      }
    };
    const actual = await lintPromise(options);
    t.assert.equal(actual.content.length, 0);
  });

  test("configParsersJSONC", async(t) => {
    t.plan(1);
    const options = {
      "strings": {
        "content": [
          "Text",
          "",
          "<!-- markdownlint-configure-file",
          "/* Comment */",
          "{",
          "  \"first-line-heading\": false // Comment",
          "}",
          "-->",
          ""
        ].join("\n")
      },
      "configParsers": [ jsoncParser.parse ]
    };
    const actual = await lintPromise(options);
    t.assert.equal(actual.content.length, 0);
  });

  test("configParsersYAML", async(t) => {
    t.plan(1);
    const options = {
      "strings": {
        "content": [
          "Text",
          "",
          "<!-- markdownlint-configure-file",
          "# Comment",
          "first-line-heading: false",
          "-->",
          ""
        ].join("\n")
      },
      "configParsers": [ yamlLoad ]
    };
    // @ts-ignore
    const actual = await lintPromise(options);
    t.assert.equal(actual.content.length, 0);
  });

  test("configParsersTOML", async(t) => {
    t.plan(1);
    const options = {
      "strings": {
        "content": [
          "Text",
          "",
          "<!-- markdownlint-configure-file",
          "# Comment",
          "first-line-heading = false",
          "-->",
          ""
        ].join("\n")
      },
      "configParsers": [
        require("toml").parse
      ]
    };
    const actual = await lintPromise(options);
    t.assert.equal(actual.content.length, 0);
  });

  test("getVersion", (t) => {
    t.plan(1);
    const actual = getVersion();
    const expected = packageJson.version;
    t.assert.equal(actual, expected, "Version string not correct.");
  });

  test("constants", (t) => {
    t.plan(2);
    // @ts-ignore
    t.assert.equal(constants.homepage, packageJson.homepage);
    // @ts-ignore
    t.assert.equal(constants.version, packageJson.version);
  });

  test("version numbers match", async(t) => {
    t.plan(441);
    const files = [
      // See previous test
      // "./package.json",
      "./CHANGELOG.md",
      "./README.md",
      "./helpers/README.md",
      "./lib/configuration-strict.d.ts",
      // See previous test
      // "./lib/constants.mjs",
      "./schema/.markdownlint.jsonc",
      "./schema/.markdownlint.yaml",
      "./schema/markdownlint-config-schema.json",
      "./schema/markdownlint-config-schema-strict.json"
    ];
    const contents = await Promise.all(files.map((file) => fs.promises.readFile(file, "utf8")));
    for (const content of contents) {
      // eslint-disable-next-line init-declarations
      let match;
      const githubProjectOrFileRe = /(?:DavidAnson\/markdownlint|markdownlint\/blob)\/v(\d+\.\d+\.\d+)/gu;
      while ((match = githubProjectOrFileRe.exec(content)) !== null) {
        t.assert.equal(match[1], packageJson.version);
      }
      const firstChangelogRe = /## (\d+\.\d+\.\d+)/u;
      match = firstChangelogRe.exec(content);
      if (match) {
        t.assert.equal(match[1], packageJson.version);
      }
    }
  });

});

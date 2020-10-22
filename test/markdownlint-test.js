// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const md = require("markdown-it")();
const pluginInline = require("markdown-it-for-inline");
const pluginSub = require("markdown-it-sub");
const pluginSup = require("markdown-it-sup");
const pluginTexMath = require("markdown-it-texmath");
const tape = require("tape");
require("tape-player");
const tv4 = require("tv4");
const packageJson = require("../package.json");
const markdownlint = require("../lib/markdownlint");
const rules = require("../lib/rules");
const customRules = require("./rules/rules.js");
const defaultConfig = require("./markdownlint-test-default-config.json");
const configSchema = require("../schema/markdownlint-config-schema.json");
const homepage = packageJson.homepage;
const version = packageJson.version;

const pluginTexMathOptions = {
  "engine": {
    "renderToString": () => ""
  }
};
const deprecatedRuleNames = new Set([ "MD002", "MD006" ]);
const configSchemaStrict = {
  ...configSchema,
  "additionalProperties": false
};

tape("simpleAsync", (test) => {
  test.plan(2);
  const options = {
    "strings": {
      "content": "# Heading"
    }
  };
  const expected = "content: 1: MD047/single-trailing-newline " +
    "Files should end with a single newline character";
  markdownlint(options, (err, actual) => {
    test.ifError(err);
    test.equal(actual.toString(), expected, "Unexpected results.");
    test.end();
  });
});

tape("simpleSync", (test) => {
  test.plan(1);
  const options = {
    "strings": {
      "content": "# Heading"
    }
  };
  const expected = "content: 1: MD047/single-trailing-newline " +
    "Files should end with a single newline character";
  const actual = markdownlint.sync(options).toString();
  test.equal(actual, expected, "Unexpected results.");
  test.end();
});

tape("simplePromise", (test) => {
  test.plan(1);
  const options = {
    "strings": {
      "content": "# Heading"
    }
  };
  const expected = "content: 1: MD047/single-trailing-newline " +
    "Files should end with a single newline character";
  markdownlint.promises.markdownlint(options).then((actual) => {
    test.equal(actual.toString(), expected, "Unexpected results.");
    test.end();
  });
});

tape("projectFilesNoInlineConfig", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "README.md",
      "CONTRIBUTING.md",
      "doc/CustomRules.md",
      "helpers/README.md"
    ],
    "noInlineConfig": true,
    "config": {
      "line-length": { "line_length": 150 },
      "no-duplicate-heading": false
    }
  };
  markdownlint(options, function callback(err, actual) {
    test.ifError(err);
    const expected = {
      "README.md": [],
      "CONTRIBUTING.md": [],
      "doc/CustomRules.md": [],
      "helpers/README.md": []
    };
    test.deepEqual(actual, expected, "Issue(s) with project files.");
    test.end();
  });
});

tape("projectFilesInlineConfig", (test) => {
  test.plan(2);
  const options = {
    "files": [ "doc/Rules.md" ],
    "config": {
      "line-length": { "line_length": 150 },
      "no-inline-html": false
    }
  };
  markdownlint(options, function callback(err, actual) {
    test.ifError(err);
    const expected = {
      "doc/Rules.md": []
    };
    test.deepEqual(actual, expected, "Issue(s) with project files.");
    test.end();
  });
});

tape("stringInputLineEndings", (test) => {
  test.plan(2);
  const options = {
    "strings": {
      "cr": "One\rTwo\r#Three\n",
      "lf": "One\nTwo\n#Three\n",
      "crlf": "One\r\nTwo\r\n#Three\n",
      "mixed": "One\rTwo\n#Three\n"
    },
    "config": defaultConfig,
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "cr": { "MD018": [ 3 ] },
      "lf": { "MD018": [ 3 ] },
      "crlf": { "MD018": [ 3 ] },
      "mixed": { "MD018": [ 3 ] }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("inputOnlyNewline", (test) => {
  test.plan(2);
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
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "cr": [],
      "lf": [],
      "crlf": []
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("defaultTrue", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "default": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ],
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("defaultFalse", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "default": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {},
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("defaultUndefined", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {},
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ],
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("disableRules", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD002": false,
      "default": true,
      "MD019": false,
      "first-line-h1": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("enableRules", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "MD002": true,
      "default": false,
      "no-multiple-space-atx": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("enableRulesMixedCase", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "Md002": true,
      "DeFaUlT": false,
      "nO-mUlTiPlE-sPaCe-AtX": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("disableTag", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "default": true,
      "spaces": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("enableTag", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "default": false,
      "spaces": true,
      "notatag": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("enableTagMixedCase", (test) => {
  test.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "DeFaUlT": false,
      "SpAcEs": true,
      "NoTaTaG": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("styleFiles", (test) => {
  test.plan(4);
  fs.readdir("./style", function readdir(err, files) {
    test.ifError(err);
    files.forEach(function forFile(file) {
      test.ok(require(path.join("../style", file)), "Unable to load/parse.");
    });
    test.end();
  });
});

tape("styleAll", (test) => {
  test.plan(2);
  const options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/all.json"),
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
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
        "MD047": [ 88 ],
        "MD048": [ 77 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("styleRelaxed", (test) => {
  test.plan(2);
  const options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/relaxed.json"),
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
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
        "MD047": [ 88 ],
        "MD048": [ 77 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("nullFrontMatter", (test) => {
  test.plan(2);
  markdownlint({
    "strings": {
      "content": "---\n\t\n---\n# Heading\n"
    },
    "frontMatter": null,
    "config": {
      "default": false,
      "MD010": true
    },
    "resultVersion": 0
  }, function callback(err, result) {
    test.ifError(err);
    const expectedResult = {
      "content": { "MD010": [ 2 ] }
    };
    test.deepEqual(result, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("customFrontMatter", (test) => {
  test.plan(2);
  markdownlint({
    "strings": {
      "content": "<head>\n\t\n</head>\n# Heading\n"
    },
    "frontMatter": /<head>[^]*<\/head>/,
    "config": {
      "default": false,
      "MD010": true
    }
  }, function callback(err, result) {
    test.ifError(err);
    const expectedResult = {
      "content": []
    };
    test.deepEqual(result, expectedResult, "Did not get empty results.");
    test.end();
  });
});

tape("noInlineConfig", (test) => {
  test.plan(2);
  markdownlint({
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
    "noInlineConfig": true,
    "resultVersion": 0
  }, function callback(err, result) {
    test.ifError(err);
    const expectedResult = {
      "content": {
        "MD010": [ 3, 7, 11 ]
      }
    };
    test.deepEqual(result, expectedResult, "Undetected issues.");
    test.end();
  });
});

tape("readmeHeadings", (test) => {
  test.plan(2);
  markdownlint({
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
          "## Demonstration",
          "## Rules / Aliases",
          "## Tags",
          "## Configuration",
          "## API",
          "### Linting",
          "#### options",
          "##### options.customRules",
          "##### options.files",
          "##### options.strings",
          "##### options.config",
          "##### options.frontMatter",
          "##### options.handleRuleFailures",
          "##### options.noInlineConfig",
          "##### options.resultVersion",
          "##### options.markdownItPlugins",
          "#### callback",
          "#### result",
          "### Config",
          "#### file",
          "#### parsers",
          "#### callback",
          "#### result",
          "## Usage",
          "## Browser",
          "## Examples",
          "## Contributing",
          "## History"
        ]
      }
    }
  }, function callback(err, result) {
    test.ifError(err);
    const expected = { "README.md": [] };
    test.deepEqual(result, expected, "Unexpected issues.");
    test.end();
  });
});

tape("filesArrayNotModified", (test) => {
  test.plan(2);
  const files = [
    "./test/atx_heading_spacing.md",
    "./test/first_heading_bad_atx.md"
  ];
  const expectedFiles = files.slice();
  markdownlint({ "files": files }, function callback(err) {
    test.ifError(err);
    test.deepEqual(files, expectedFiles, "Files modified.");
    test.end();
  });
});

tape("filesArrayAsString", (test) => {
  test.plan(2);
  markdownlint({
    "files": "README.md",
    "noInlineConfig": true,
    "config": {
      "MD013": { "line_length": 150 },
      "MD024": false
    }
  }, function callback(err, actual) {
    test.ifError(err);
    const expected = { "README.md": [] };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.end();
  });
});

tape("missingOptions", (test) => {
  test.plan(2);
  markdownlint(null, function callback(err, result) {
    test.ifError(err);
    test.deepEqual(
      result,
      {},
      "Did not get empty result for missing options."
    );
    test.end();
  });
});

tape("missingFilesAndStrings", (test) => {
  test.plan(2);
  markdownlint({}, function callback(err, result) {
    test.ifError(err);
    test.ok(result, "Did not get result for missing files/strings.");
    test.end();
  });
});

tape("missingCallback", (test) => {
  test.plan(0);
  // @ts-ignore
  markdownlint();
  test.end();
});

tape("badFile", (test) => {
  test.plan(4);
  markdownlint({
    "files": [ "./badFile" ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for bad file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    // @ts-ignore
    test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    test.ok(!result, "Got result for bad file.");
    test.end();
  });
});

tape("badFileSync", (test) => {
  test.plan(1);
  test.throws(
    function badFileCall() {
      markdownlint.sync({
        "files": [ "./badFile" ]
      });
    },
    /ENOENT/,
    "Did not get correct exception for bad file."
  );
  test.end();
});

tape("badFilePromise", (test) => {
  test.plan(3);
  markdownlint.promises.markdownlint({
    "files": [ "./badFile" ]
  }).then(
    null,
    (error) => {
      test.ok(error, "Did not get an error for bad file.");
      test.ok(error instanceof Error, "Error not instance of Error.");
      test.equal(error.code, "ENOENT", "Error code for bad file not ENOENT.");
      test.end();
    }
  );
});

tape("missingStringValue", (test) => {
  test.plan(2);
  markdownlint({
    "strings": {
      "undefined": undefined,
      "null": null,
      "empty": ""
    },
    "config": defaultConfig
  }, function callback(err, result) {
    test.ifError(err);
    const expectedResult = {
      "undefined": [],
      "null": [],
      "empty": []
    };
    test.deepEqual(result, expectedResult, "Did not get empty results.");
    test.end();
  });
});

tape("readme", (test) => {
  test.plan(115);
  const tagToRules = {};
  rules.forEach(function forRule(rule) {
    rule.tags.forEach(function forTag(tag) {
      const tagRules = tagToRules[tag] || [];
      tagRules.push(rule.names[0]);
      tagToRules[tag] = tagRules;
    });
  });
  fs.readFile("README.md", "utf8",
    function readFile(err, contents) {
      test.ifError(err);
      const rulesLeft = rules.slice();
      let seenRelated = false;
      let seenRules = false;
      let inRules = false;
      let seenTags = false;
      let inTags = false;
      md.parse(contents, {}).forEach(function forToken(token) {
        if (
          (token.type === "bullet_list_open") &&
          (token.level === 0)
        ) {
          if (!seenRelated) {
            seenRelated = true;
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
            test.ok(rule,
              "Missing rule implementation for " + token.content + ".");
            if (rule) {
              const ruleName = rule.names[0];
              const ruleAliases = rule.names.slice(1);
              let expected = "**[" + ruleName + "](doc/Rules.md#" +
                ruleName.toLowerCase() + ")** *" +
                ruleAliases.join("/") + "* - " + rule.description;
              if (deprecatedRuleNames.has(ruleName)) {
                expected = "~~" + expected + "~~";
              }
              test.equal(token.content, expected, "Rule mismatch.");
            }
          } else if (inTags) {
            const parts =
              token.content.replace(/\*\*/g, "").split(/ - |, |,\n/);
            const tag = parts.shift();
            test.deepEqual(parts, tagToRules[tag] || [],
              "Rule mismatch for tag " + tag + ".");
            delete tagToRules[tag];
          }
        }
      });
      const ruleLeft = rulesLeft.shift();
      test.ok(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || "[NO RULE]").toString() + ".");
      const tagLeft = Object.keys(tagToRules).shift();
      test.ok(!tagLeft, "Undocumented tag " + tagLeft + ".");
      test.end();
    });
});

tape("rules", (test) => {
  test.plan(336);
  fs.readFile("doc/Rules.md", "utf8",
    (err, contents) => {
      test.ifError(err);
      const rulesLeft = rules.slice();
      let inHeading = false;
      let rule = null;
      let ruleHasTags = true;
      let ruleHasAliases = true;
      let ruleUsesParams = null;
      const tagAliasParameterRe = /, |: | /;
      // eslint-disable-next-line func-style
      const testTagsAliasesParams = (r) => {
        r = r || "[NO RULE]";
        test.ok(ruleHasTags,
          "Missing tags for rule " + r.names + ".");
        test.ok(ruleHasAliases,
          "Missing aliases for rule " + r.names + ".");
        test.ok(!ruleUsesParams,
          "Missing parameters for rule " + r.names + ".");
      };
      md.parse(contents, {}).forEach(function forToken(token) {
        if ((token.type === "heading_open") && (token.tag === "h2")) {
          inHeading = true;
        } else if (token.type === "heading_close") {
          inHeading = false;
        } else if (token.type === "inline") {
          if (inHeading) {
            testTagsAliasesParams(rule);
            rule = rulesLeft.shift();
            ruleHasTags = false;
            ruleHasAliases = false;
            test.ok(rule,
              "Missing rule implementation for " + token.content + ".");
            const ruleName = rule.names[0];
            let headingContent = ruleName + " - " + rule.description;
            if (deprecatedRuleNames.has(ruleName)) {
              headingContent = "~~" + headingContent + "~~";
            }
            test.equal(token.content,
              headingContent,
              "Rule mismatch.");
            ruleUsesParams = rule.function.toString()
              .match(/params\.config\.[_a-z]*/gi);
            if (ruleUsesParams) {
              ruleUsesParams = ruleUsesParams.map(function forUse(use) {
                return use.split(".").pop();
              });
              ruleUsesParams.sort();
            }
          } else if (token.content.startsWith("Tags: ") && rule) {
            test.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.tags, "Tag mismatch for rule " + rule.names + ".");
            ruleHasTags = true;
          } else if (token.content.startsWith("Aliases: ") && rule) {
            test.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.names.slice(1),
              "Alias mismatch for rule " + rule.names + ".");
            ruleHasAliases = true;
          } else if (token.content.startsWith("Parameters: ") && rule) {
            let inDetails = false;
            const parameters = token.content.split(tagAliasParameterRe)
              .slice(1)
              .filter(function forPart(part) {
                inDetails = inDetails || (part[0] === "(");
                return !inDetails;
              });
            parameters.sort();
            test.deepEqual(parameters, ruleUsesParams,
              "Missing parameter for rule " + rule.names);
            ruleUsesParams = null;
          }
        }
      });
      const ruleLeft = rulesLeft.shift();
      test.ok(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || { "names": "[NO RULE]" }).names + ".");
      if (rule) {
        testTagsAliasesParams(rule);
      }
      test.end();
    });
});

tape("validateJsonUsingConfigSchemaStrict", (test) => {
  const jsonFileRe = /\.json$/i;
  const resultsFileRe = /\.results\.json$/i;
  const jsConfigFileRe = /^jsconfig\.json$/i;
  const wrongTypesFileRe = /wrong-types-in-config-file.json$/i;
  const testDirectory = __dirname;
  const testFiles = fs.readdirSync(testDirectory);
  testFiles.filter(function filterFile(file) {
    return jsonFileRe.test(file) &&
      !resultsFileRe.test(file) &&
      !jsConfigFileRe.test(file) &&
      !wrongTypesFileRe.test(file);
  }).forEach(function forFile(file) {
    const data = fs.readFileSync(
      path.join(testDirectory, file),
      "utf8"
    );
    test.ok(
      // @ts-ignore
      tv4.validate(JSON.parse(data), configSchemaStrict),
      file + "\n" + JSON.stringify(tv4.error, null, 2));
  });
  test.end();
});

tape("validateConfigSchemaAllowsUnknownProperties", (test) => {
  test.plan(4);
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
  testCases.forEach((testCase) => {
    test.ok(
      // @ts-ignore
      tv4.validate(testCase, configSchema),
      "Unknown property blocked by default: " + JSON.stringify(testCase));
    test.notok(
      // @ts-ignore
      tv4.validate(testCase, configSchemaStrict),
      "Unknown property allowed when strict: " + JSON.stringify(testCase));
  });
  test.end();
});

tape("configSingle", (test) => {
  test.plan(2);
  markdownlint.readConfig("./test/config/config-child.json",
    function callback(err, actual) {
      test.ifError(err);
      const expected = require("./config/config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.end();
    });
});

tape("configAbsolute", (test) => {
  test.plan(2);
  markdownlint.readConfig(path.join(__dirname, "config", "config-child.json"),
    function callback(err, actual) {
      test.ifError(err);
      const expected = require("./config/config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.end();
    });
});

tape("configMultiple", (test) => {
  test.plan(2);
  markdownlint.readConfig("./test/config/config-grandparent.json",
    function callback(err, actual) {
      test.ifError(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      test.deepEqual(actual, expected, "Config object not correct.");
      test.end();
    });
});

tape("configMultipleWithRequireResolve", (test) => {
  test.plan(2);
  markdownlint.readConfig("./test/config/config-packageparent.json",
    function callback(err, actual) {
      test.ifError(err);
      const expected = {
        ...require("./node_modules/pseudo-package/config-frompackage.json"),
        ...require("./config/config-packageparent.json")
      };
      delete expected.extends;
      test.deepEqual(actual, expected, "Config object not correct.");
      test.end();
    });
});

tape("configBadFile", (test) => {
  test.plan(4);
  markdownlint.readConfig("./test/config/config-badfile.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad file.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
      test.ok(!result, "Got result for bad file.");
      test.end();
    });
});

tape("configBadChildFile", (test) => {
  test.plan(4);
  markdownlint.readConfig("./test/config/config-badchildfile.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child file.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      test.equal(err.code, "ENOENT",
        "Error code for bad child file not ENOENT.");
      test.ok(!result, "Got result for bad child file.");
      test.end();
    });
});

tape("configBadChildPackage", (test) => {
  test.plan(4);
  markdownlint.readConfig("./test/config/config-badchildpackage.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child package.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      test.equal(err.code, "ENOENT",
        "Error code for bad child package not ENOENT.");
      test.ok(!result, "Got result for bad child package.");
      test.end();
    });
});

tape("configBadJson", (test) => {
  test.plan(3);
  markdownlint.readConfig("./test/config/config-badjson.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad JSON.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.ok(!result, "Got result for bad JSON.");
      test.end();
    });
});

tape("configBadChildJson", (test) => {
  test.plan(3);
  markdownlint.readConfig("./test/config/config-badchildjson.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child JSON.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.ok(!result, "Got result for bad child JSON.");
      test.end();
    });
});

tape("configSingleYaml", (test) => {
  test.plan(2);
  markdownlint.readConfig(
    "./test/config/config-child.yaml",
    // @ts-ignore
    [ require("js-yaml").safeLoad ],
    function callback(err, actual) {
      test.ifError(err);
      const expected = require("./config/config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.end();
    });
});

tape("configMultipleYaml", (test) => {
  test.plan(2);
  markdownlint.readConfig(
    "./test/config/config-grandparent.yaml",
    // @ts-ignore
    [ require("js-yaml").safeLoad ],
    function callback(err, actual) {
      test.ifError(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      test.deepEqual(actual, expected, "Config object not correct.");
      test.end();
    });
});

tape("configMultipleHybrid", (test) => {
  test.plan(2);
  markdownlint.readConfig(
    "./test/config/config-grandparent-hybrid.yaml",
    // @ts-ignore
    [ JSON.parse, require("toml").parse, require("js-yaml").safeLoad ],
    function callback(err, actual) {
      test.ifError(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      test.deepLooseEqual(actual, expected, "Config object not correct.");
      test.end();
    });
});

tape("configBadHybrid", (test) => {
  test.plan(4);
  markdownlint.readConfig(
    "./test/config/config-badcontent.txt",
    // @ts-ignore
    [ JSON.parse, require("toml").parse, require("js-yaml").safeLoad ],
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child JSON.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.ok(err.message.match(
        // eslint-disable-next-line max-len
        /^Unable to parse '[^']*'; Unexpected token \S+ in JSON at position \d+; Expected [^;]+ or end of input but "\S+" found.; end of the stream or a document separator is expected at line \d+, column \d+:[^;]*$/
      ), "Error message unexpected.");
      test.ok(!result, "Got result for bad child JSON.");
      test.end();
    });
});

tape("configSingleSync", (test) => {
  test.plan(1);
  const actual = markdownlint.readConfigSync("./test/config/config-child.json");
  const expected = require("./config/config-child.json");
  test.deepEqual(actual, expected, "Config object not correct.");
  test.end();
});

tape("configAbsoluteSync", (test) => {
  test.plan(1);
  const actual = markdownlint.readConfigSync(
    path.join(__dirname, "config", "config-child.json"));
  const expected = require("./config/config-child.json");
  test.deepEqual(actual, expected, "Config object not correct.");
  test.end();
});

tape("configMultipleSync", (test) => {
  test.plan(1);
  const actual =
    markdownlint.readConfigSync("./test/config/config-grandparent.json");
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  test.deepEqual(actual, expected, "Config object not correct.");
  test.end();
});

tape("configBadFileSync", (test) => {
  test.plan(1);
  test.throws(
    function badFileCall() {
      markdownlint.readConfigSync("./test/config/config-badfile.json");
    },
    /ENOENT/,
    "Did not get correct exception for bad file."
  );
  test.end();
});

tape("configBadChildFileSync", (test) => {
  test.plan(1);
  test.throws(
    function badChildFileCall() {
      markdownlint.readConfigSync("./test/config/config-badchildfile.json");
    },
    /ENOENT/,
    "Did not get correct exception for bad child file."
  );
  test.end();
});

tape("configBadJsonSync", (test) => {
  test.plan(1);
  test.throws(
    function badJsonCall() {
      markdownlint.readConfigSync("./test/config/config-badjson.json");
    },
    /Unable to parse '[^']*'; Unexpected token \S+ in JSON at position \d+/,
    "Did not get correct exception for bad JSON."
  );
  test.end();
});

tape("configBadChildJsonSync", (test) => {
  test.plan(1);
  test.throws(
    function badChildJsonCall() {
      markdownlint.readConfigSync("./test/config/config-badchildjson.json");
    },
    /Unable to parse '[^']*'; Unexpected token \S+ in JSON at position \d+/,
    "Did not get correct exception for bad child JSON."
  );
  test.end();
});

tape("configSingleYamlSync", (test) => {
  test.plan(1);
  const actual = markdownlint.readConfigSync(
    // @ts-ignore
    "./test/config/config-child.yaml", [ require("js-yaml").safeLoad ]);
  const expected = require("./config/config-child.json");
  test.deepEqual(actual, expected, "Config object not correct.");
  test.end();
});

tape("configMultipleYamlSync", (test) => {
  test.plan(1);
  const actual = markdownlint.readConfigSync(
    // @ts-ignore
    "./test/config/config-grandparent.yaml", [ require("js-yaml").safeLoad ]);
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  test.deepEqual(actual, expected, "Config object not correct.");
  test.end();
});

tape("configMultipleHybridSync", (test) => {
  test.plan(1);
  const actual = markdownlint.readConfigSync(
    "./test/config/config-grandparent-hybrid.yaml",
    // @ts-ignore
    [ JSON.parse, require("toml").parse, require("js-yaml").safeLoad ]);
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  test.deepLooseEqual(actual, expected, "Config object not correct.");
  test.end();
});

tape("configBadHybridSync", (test) => {
  test.plan(1);
  test.throws(
    function badHybridCall() {
      markdownlint.readConfigSync(
        "./test/config/config-badcontent.txt",
        // @ts-ignore
        [ JSON.parse, require("toml").parse, require("js-yaml").safeLoad ]);
    },
    // eslint-disable-next-line max-len
    /Unable to parse '[^']*'; Unexpected token \S+ in JSON at position \d+; Expected [^;]+ or end of input but "\S+" found.; end of the stream or a document separator is expected at line \d+, column \d+:[^;]*/,
    "Did not get correct exception for bad content."
  );
  test.end();
});

tape("configSinglePromise", (test) => {
  test.plan(1);
  markdownlint.promises.readConfig("./test/config/config-child.json")
    .then((actual) => {
      const expected = require("./config/config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.end();
    });
});

tape("configBadFilePromise", (test) => {
  test.plan(2);
  markdownlint.promises.readConfig("./test/config/config-badfile.json")
    .then(
      null,
      (error) => {
        test.ok(error, "Did not get an error for bad JSON.");
        test.ok(error instanceof Error, "Error not instance of Error.");
        test.end();
      }
    );
});

tape("allBuiltInRulesHaveValidUrl", (test) => {
  test.plan(132);
  rules.forEach(function forRule(rule) {
    test.ok(rule.information);
    test.ok(Object.getPrototypeOf(rule.information) === URL.prototype);
    const name = rule.names[0].toLowerCase();
    test.equal(
      rule.information.href,
      `${homepage}/blob/v${version}/doc/Rules.md#${name}`
    );
  });
  test.end();
});

tape("someCustomRulesHaveValidUrl", (test) => {
  test.plan(7);
  customRules.all.forEach(function forRule(rule) {
    test.ok(!rule.information ||
      (Object.getPrototypeOf(rule.information) === URL.prototype));
    if (rule === customRules.anyBlockquote) {
      test.equal(
        rule.information.href,
        `${homepage}/blob/main/test/rules/any-blockquote.js`
      );
    } else if (rule === customRules.lettersEX) {
      test.equal(
        rule.information.href,
        `${homepage}/blob/main/test/rules/letters-E-X.js`
      );
    }
  });
  test.end();
});

tape("markdownItPluginsSingle", (test) => {
  test.plan(2);
  markdownlint({
    "strings": {
      "string": "# Heading\n\nText [ link ](https://example.com)\n"
    },
    "markdownItPlugins": [
      [
        pluginInline,
        "trim_text_plugin",
        "text",
        function iterator(tokens, index) {
          tokens[index].content = tokens[index].content.trim();
        }
      ]
    ]
  }, function callback(err, actual) {
    test.ifError(err);
    const expected = { "string": [] };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.end();
  });
});

tape("markdownItPluginsMultiple", (test) => {
  test.plan(4);
  markdownlint({
    "strings": {
      "string": "# Heading\n\nText H~2~0 text 29^th^ text\n"
    },
    "markdownItPlugins": [
      [ pluginSub ],
      [ pluginSup ],
      [ pluginInline, "check_sub_plugin", "sub_open", test.ok ],
      [ pluginInline, "check_sup_plugin", "sup_open", test.ok ]
    ]
  }, function callback(err, actual) {
    test.ifError(err);
    const expected = { "string": [] };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.end();
  });
});

tape("markdownItPluginsMathjax", (test) => {
  test.plan(2);
  markdownlint({
    "strings": {
      "string":
        "# Heading\n" +
        "\n" +
        "$1 *2* 3$\n" +
        "\n" +
        "$$1 *2* 3$$\n" +
        "\n" +
        "$$1\n" +
        "+ 2\n" +
        "+ 3$$\n"
    },
    "markdownItPlugins": [ [ pluginTexMath, pluginTexMathOptions ] ]
  }, function callback(err, actual) {
    test.ifError(err);
    const expected = { "string": [] };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.end();
  });
});

tape("markdownItPluginsMathjaxIssue166", (test) => {
  test.plan(2);
  markdownlint({
    "strings": {
      "string":
`## Heading

$$
1
$$$$
2
$$\n`
    },
    "markdownItPlugins": [ [ pluginTexMath, pluginTexMathOptions ] ],
    "resultVersion": 0
  }, function callback(err, actual) {
    test.ifError(err);
    const expected = {
      "string": {
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.end();
  });
});

tape("getVersion", (test) => {
  test.plan(1);
  const actual = markdownlint.getVersion();
  const expected = packageJson.version;
  test.equal(actual, expected, "Version string not correct.");
  test.end();
});

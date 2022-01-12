// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");
const md = require("markdown-it")();
const pluginInline = require("markdown-it-for-inline");
const pluginSub = require("markdown-it-sub");
const pluginSup = require("markdown-it-sup");
const pluginTexMath = require("markdown-it-texmath");
const test = require("ava").default;
const tv4 = require("tv4");
const { homepage, version } = require("../package.json");
const markdownlint = require("../lib/markdownlint");
const constants = require("../lib/constants");
const rules = require("../lib/rules");
const customRules = require("./rules/rules.js");
const configSchema = require("../schema/markdownlint-config-schema.json");

const pluginTexMathOptions = {
  "engine": {
    "renderToString": () => ""
  }
};
const deprecatedRuleNames = new Set(constants.deprecatedRuleNames);
const configSchemaStrict = {
  ...configSchema,
  "additionalProperties": false
};

test.cb("simpleAsync", (t) => {
  t.plan(2);
  const options = {
    "strings": {
      "content": "# Heading"
    }
  };
  const expected = "content: 1: MD047/single-trailing-newline " +
    "Files should end with a single newline character";
  markdownlint(options, (err, actual) => {
    t.falsy(err);
    t.is(actual.toString(), expected, "Unexpected results.");
    t.end();
  });
});

test("simpleSync", (t) => {
  t.plan(1);
  const options = {
    "strings": {
      "content": "# Heading"
    }
  };
  const expected = "content: 1: MD047/single-trailing-newline " +
    "Files should end with a single newline character";
  const actual = markdownlint.sync(options).toString();
  t.is(actual, expected, "Unexpected results.");
});

test("simplePromise", (t) => {
  t.plan(1);
  const options = {
    "strings": {
      "content": "# Heading"
    }
  };
  const expected = "content: 1: MD047/single-trailing-newline " +
    "Files should end with a single newline character";
  return markdownlint.promises.markdownlint(options).then((actual) => {
    t.is(actual.toString(), expected, "Unexpected results.");
  });
});

test.cb("projectFilesNoInlineConfig", (t) => {
  t.plan(2);
  const options = {
    "files": [
      "README.md",
      "CONTRIBUTING.md",
      "doc/CustomRules.md",
      "doc/Prettier.md",
      "helpers/README.md"
    ],
    "config": {
      "line-length": { "line_length": 150 },
      "no-duplicate-heading": false
    },
    "customRules": [ require("markdownlint-rule-github-internal-links") ],
    "noInlineConfig": true
  };
  markdownlint(options, function callback(err, actual) {
    t.falsy(err);
    const expected = {
      "README.md": [],
      "CONTRIBUTING.md": [],
      "doc/CustomRules.md": [],
      "doc/Prettier.md": [],
      "helpers/README.md": []
    };
    t.deepEqual(actual, expected, "Issue(s) with project files.");
    t.end();
  });
});

test.cb("projectFilesInlineConfig", (t) => {
  t.plan(2);
  const options = {
    "files": [ "doc/Rules.md" ],
    "config": {
      "no-inline-html": false
    }
  };
  markdownlint(options, function callback(err, actual) {
    t.falsy(err);
    const expected = {
      "doc/Rules.md": []
    };
    t.deepEqual(actual, expected, "Issue(s) with project files.");
    t.end();
  });
});

test.cb("stringInputLineEndings", (t) => {
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
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "cr": { "MD018": [ 3 ] },
      "lf": { "MD018": [ 3 ] },
      "crlf": { "MD018": [ 3 ] },
      "mixed": { "MD018": [ 3 ] }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("inputOnlyNewline", (t) => {
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
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "cr": [],
      "lf": [],
      "crlf": []
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("defaultTrue", (t) => {
  t.plan(2);
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
    t.falsy(err);
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
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("defaultFalse", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {},
      "./test/first_heading_bad_atx.md": {}
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("defaultUndefined", (t) => {
  t.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {},
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
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
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("disableRules", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("enableRules", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("enableRulesMixedCase", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("disableTag", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD041": [ 1 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("enableTag", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("enableTagMixedCase", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("styleFiles", (t) => {
  t.plan(4);
  fs.readdir("./style", function readdir(err, files) {
    t.falsy(err);
    files.forEach(function forFile(file) {
      t.truthy(require(path.join("../style", file)), "Unable to load/parse.");
    });
    t.end();
  });
});

test.cb("styleAll", (t) => {
  t.plan(2);
  const options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/all.json"),
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
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
        "MD047": [ 96 ],
        "MD048": [ 77 ],
        "MD049": [ 90 ],
        "MD050": [ 94 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("styleRelaxed", (t) => {
  t.plan(2);
  const options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/relaxed.json"),
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
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
        "MD047": [ 96 ],
        "MD048": [ 77 ],
        "MD049": [ 90 ],
        "MD050": [ 94 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("nullFrontMatter", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "content": { "MD010": [ 2 ] }
    };
    // @ts-ignore
    t.deepEqual(result, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("customFrontMatter", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "content": []
    };
    t.deepEqual(result, expectedResult, "Did not get empty results.");
    t.end();
  });
});

test.cb("noInlineConfig", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expectedResult = {
      "content": {
        "MD010": [ 3, 7, 11 ]
      }
    };
    // @ts-ignore
    t.deepEqual(result, expectedResult, "Undetected issues.");
    t.end();
  });
});

test.cb("readmeHeadings", (t) => {
  t.plan(2);
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
          "##### options.fs",
          "#### callback",
          "#### result",
          "### Config",
          "#### file",
          "#### parsers",
          "#### fs",
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
    t.falsy(err);
    const expected = { "README.md": [] };
    t.deepEqual(result, expected, "Unexpected issues.");
    t.end();
  });
});

test.cb("filesArrayNotModified", (t) => {
  t.plan(2);
  const files = [
    "./test/atx_heading_spacing.md",
    "./test/first_heading_bad_atx.md"
  ];
  const expectedFiles = [ ...files ];
  markdownlint({ "files": files }, function callback(err) {
    t.falsy(err);
    t.deepEqual(files, expectedFiles, "Files modified.");
    t.end();
  });
});

test.cb("filesArrayAsString", (t) => {
  t.plan(2);
  markdownlint({
    "files": "README.md",
    "noInlineConfig": true,
    "config": {
      "MD013": { "line_length": 150 },
      "MD024": false
    }
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = { "README.md": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test.cb("missingOptions", (t) => {
  t.plan(2);
  markdownlint(null, function callback(err, result) {
    t.falsy(err);
    t.deepEqual(
      result,
      {},
      "Did not get empty result for missing options."
    );
    t.end();
  });
});

test.cb("missingFilesAndStrings", (t) => {
  t.plan(2);
  markdownlint({}, function callback(err, result) {
    t.falsy(err);
    t.truthy(result, "Did not get result for missing files/strings.");
    t.end();
  });
});

test("missingCallback", (t) => {
  t.plan(0);
  // @ts-ignore
  markdownlint();
});

test.cb("badFile", (t) => {
  t.plan(4);
  markdownlint({
    "files": [ "./badFile" ]
  }, function callback(err, result) {
    t.truthy(err, "Did not get an error for bad file.");
    t.true(err instanceof Error, "Error not instance of Error.");
    // @ts-ignore
    t.is(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    t.true(!result, "Got result for bad file.");
    t.end();
  });
});

test("badFileSync", (t) => {
  t.plan(1);
  t.throws(
    function badFileCall() {
      markdownlint.sync({
        "files": [ "./badFile" ]
      });
    },
    {
      "message": /ENOENT/
    },
    "Did not get correct exception for bad file."
  );
});

test.cb("badFilePromise", (t) => {
  t.plan(3);
  markdownlint.promises.markdownlint({
    "files": [ "./badFile" ]
  }).then(
    null,
    (error) => {
      t.truthy(error, "Did not get an error for bad file.");
      t.true(error instanceof Error, "Error not instance of Error.");
      t.is(error.code, "ENOENT", "Error code for bad file not ENOENT.");
      t.end();
    }
  );
});

test.cb("missingStringValue", (t) => {
  t.plan(2);
  markdownlint({
    "strings": {
      "undefined": undefined,
      "null": null,
      "empty": ""
    }
  }, function callback(err, result) {
    t.falsy(err);
    const expectedResult = {
      "undefined": [],
      "null": [],
      "empty": []
    };
    t.deepEqual(result, expectedResult, "Did not get empty results.");
    t.end();
  });
});

test("customFileSystemSync", (t) => {
  t.plan(2);
  const file = "/dir/file.md";
  const fsApi = {
    "readFileSync": (p) => {
      t.is(p, file);
      return "# Heading";
    }
  };
  const result = markdownlint.sync({
    "files": file,
    "fs": fsApi
  });
  t.deepEqual(result[file].length, 1, "Did not report violations.");
});

test.cb("customFileSystemAsync", (t) => {
  t.plan(3);
  const file = "/dir/file.md";
  const fsApi = {
    "readFile": (p, o, cb) => {
      t.is(p, file);
      cb(null, "# Heading");
    }
  };
  markdownlint({
    "files": file,
    "fs": fsApi
  }, function callback(err, result) {
    t.falsy(err);
    t.deepEqual(result[file].length, 1, "Did not report violations.");
    t.end();
  });
});

test.cb("readme", (t) => {
  t.plan(119);
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
      t.falsy(err);
      const rulesLeft = [ ...rules ];
      let seenRelated = false;
      let seenRules = false;
      let inRules = false;
      let seenTags = false;
      let inTags = false;
      // @ts-ignore
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
            t.truthy(rule,
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
              t.is(token.content, expected, "Rule mismatch.");
            }
          } else if (inTags) {
            const parts =
              token.content.replace(/\*\*/g, "").split(/ - |, |,\n/);
            const tag = parts.shift();
            t.deepEqual(parts, tagToRules[tag] || [],
              "Rule mismatch for tag " + tag + ".");
            delete tagToRules[tag];
          }
        }
      });
      const ruleLeft = rulesLeft.shift();
      t.true(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || "[NO RULE]").toString() + ".");
      const tagLeft = Object.keys(tagToRules).shift();
      t.true(!tagLeft, "Undocumented tag " + tagLeft + ".");
      t.end();
    });
});

test.cb("rules", (t) => {
  t.plan(352);
  fs.readFile("doc/Rules.md", "utf8",
    (err, contents) => {
      t.falsy(err);
      const rulesLeft = [ ...rules ];
      let inHeading = false;
      let rule = null;
      let ruleHasTags = true;
      let ruleHasAliases = true;
      let ruleUsesParams = null;
      const tagAliasParameterRe = /, |: | /;
      const testTagsAliasesParams = (r) => {
        // eslint-disable-next-line unicorn/prefer-default-parameters
        r = r || "[NO RULE]";
        t.true(ruleHasTags,
          "Missing tags for rule " + r.names + ".");
        t.true(ruleHasAliases,
          "Missing aliases for rule " + r.names + ".");
        t.true(!ruleUsesParams,
          "Missing parameters for rule " + r.names + ".");
      };
      // @ts-ignore
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
            t.truthy(rule,
              "Missing rule implementation for " + token.content + ".");
            const ruleName = rule.names[0];
            let headingContent = ruleName + " - " + rule.description;
            if (deprecatedRuleNames.has(ruleName)) {
              headingContent = "~~" + headingContent + "~~";
            }
            t.is(token.content,
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
            t.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.tags, "Tag mismatch for rule " + rule.names + ".");
            ruleHasTags = true;
          } else if (token.content.startsWith("Aliases: ") && rule) {
            t.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
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
            t.deepEqual(parameters, ruleUsesParams,
              "Missing parameter for rule " + rule.names);
            ruleUsesParams = null;
          }
        }
      });
      const ruleLeft = rulesLeft.shift();
      t.true(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || { "names": "[NO RULE]" }).names + ".");
      if (rule) {
        testTagsAliasesParams(rule);
      }
      t.end();
    });
});

test("validateJsonUsingConfigSchemaStrict", (t) => {
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
    t.true(
      // @ts-ignore
      tv4.validate(JSON.parse(data), configSchemaStrict),
      file + "\n" + JSON.stringify(tv4.error, null, 2));
  });
});

test("validateConfigSchemaAllowsUnknownProperties", (t) => {
  t.plan(4);
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
    t.true(
      // @ts-ignore
      tv4.validate(testCase, configSchema),
      "Unknown property blocked by default: " + JSON.stringify(testCase));
    t.false(
      // @ts-ignore
      tv4.validate(testCase, configSchemaStrict),
      "Unknown property allowed when strict: " + JSON.stringify(testCase));
  });
});

test("validateConfigSchemaAppliesToUnknownProperties", (t) => {
  t.plan(4);
  for (const allowed of [ true, {} ]) {
    t.true(
      // @ts-ignore
      tv4.validate({ "property": allowed }, configSchema),
      `Unknown property value ${allowed} blocked`);
  }
  for (const blocked of [ 2, "string" ]) {
    t.false(
      // @ts-ignore
      tv4.validate({ "property": blocked }, configSchema),
      `Unknown property value ${blocked} allowed`);
  }
});

test("validateConfigExampleJson", async(t) => {
  t.plan(2);
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const { "default": stripJsonComments } = await import("strip-json-comments");
  // Validate JSONC
  const fileJson = ".markdownlint.jsonc";
  const dataJson = fs.readFileSync(
    path.join(__dirname, "../schema", fileJson),
    "utf8"
  );
  const jsonObject = JSON.parse(stripJsonComments(dataJson));
  t.true(
    // @ts-ignore
    tv4.validate(jsonObject, configSchemaStrict),
    fileJson + "\n" + JSON.stringify(tv4.error, null, 2));
  // Validate YAML
  const fileYaml = ".markdownlint.yaml";
  const dataYaml = fs.readFileSync(
    path.join(__dirname, "../schema", fileYaml),
    "utf8"
  );
  const yamlObject = jsYaml.load(dataYaml);
  t.deepEqual(yamlObject, jsonObject,
    "YAML example does not match JSON example.");
});

test("allBuiltInRulesHaveValidUrl", (t) => {
  t.plan(138);
  rules.forEach(function forRule(rule) {
    t.truthy(rule.information);
    t.true(Object.getPrototypeOf(rule.information) === URL.prototype);
    const name = rule.names[0].toLowerCase();
    t.is(
      rule.information.href,
      `${homepage}/blob/v${version}/doc/Rules.md#${name}`
    );
  });
});

test("someCustomRulesHaveValidUrl", (t) => {
  t.plan(8);
  customRules.all.forEach(function forRule(rule) {
    t.true(!rule.information ||
      (Object.getPrototypeOf(rule.information) === URL.prototype));
    if (rule === customRules.anyBlockquote) {
      t.is(
        rule.information.href,
        `${homepage}/blob/main/test/rules/any-blockquote.js`
      );
    } else if (rule === customRules.lettersEX) {
      t.is(
        rule.information.href,
        `${homepage}/blob/main/test/rules/letters-E-X.js`
      );
    }
  });
});

test.cb("markdownItPluginsSingle", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test.cb("markdownItPluginsMultiple", (t) => {
  t.plan(4);
  markdownlint({
    "strings": {
      "string": "# Heading\n\nText H~2~0 text 29^th^ text\n"
    },
    "markdownItPlugins": [
      [ pluginSub ],
      [ pluginSup ],
      [ pluginInline, "check_sub_plugin", "sub_open", () => t.true(true) ],
      [ pluginInline, "check_sup_plugin", "sup_open", () => t.true(true) ]
    ]
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test.cb("markdownItPluginsMathjax", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test.cb("markdownItPluginsMathjaxIssue166", (t) => {
  t.plan(2);
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
    t.falsy(err);
    const expected = {
      "string": {
        "MD041": [ 1 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test.cb("texmath test files with texmath plugin", (t) => {
  t.plan(2);
  markdownlint({
    "files": [
      "./test/texmath-content-in-lists.md",
      "./test/texmath-content-violating-md037.md"
    ],
    "markdownItPlugins": [ [ pluginTexMath, pluginTexMathOptions ] ]
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = {
      "./test/texmath-content-in-lists.md": [],
      "./test/texmath-content-violating-md037.md": []
    };
    t.deepEqual(actual, expected, "Unexpected issues.");
    t.end();
  });
});

test("token-map-spans", (t) => {
  t.plan(38);
  const options = {
    "customRules": [
      {
        "names": [ "token-map-spans" ],
        "description": "token-map-spans",
        "tags": [ "tms" ],
        "function": function tokenMapSpans(params) {
          const tokenLines = [];
          let lastLineNumber = -1;
          const inlines = params.tokens.filter((c) => c.type === "inline");
          for (const token of inlines) {
            t.truthy(token.map);
            for (let i = token.map[0]; i < token.map[1]; i++) {
              if (tokenLines.includes(i)) {
                t.true(
                  lastLineNumber === token.lineNumber,
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
    ],
    "files": [ "./test/token-map-spans.md" ]
  };
  markdownlint.sync(options);
});

test("getVersion", (t) => {
  t.plan(1);
  const actual = markdownlint.getVersion();
  const expected = version;
  t.is(actual, expected, "Version string not correct.");
});

test("constants", (t) => {
  t.plan(2);
  t.is(constants.homepage, homepage);
  t.is(constants.version, version);
});

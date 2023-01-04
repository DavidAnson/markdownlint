// @ts-check

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const jsYaml = require("js-yaml");
const md = require("markdown-it")();
const pluginFootnote = require("markdown-it-footnote");
const pluginInline = require("markdown-it-for-inline");
const pluginSub = require("markdown-it-sub");
const pluginSup = require("markdown-it-sup");
const pluginTexMath = require("markdown-it-texmath");
const test = require("ava").default;
const tv4 = require("tv4");
const { "exports": packageExports, homepage, version } =
  require("../package.json");
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

test("simpleAsync", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

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

test("projectFiles", (t) => new Promise((resolve) => {
  t.plan(2);
  import("globby")
    .then((module) => module.globby("doc/*.md"))
    .then((files) => [
      ...files,
      "CHANGELOG.md",
      "CONTRIBUTING.md",
      "README.md",
      "helpers/README.md"
    ])
    .then((files) => {
      const options = {
        files,
        "config": require("../.markdownlint.json")
      };
      markdownlint(options, function callback(err, actual) {
        t.falsy(err);
        const expected = {};
        for (const file of files) {
          expected[file] = [];
        }
        t.deepEqual(actual, expected, "Issue(s) with project files.");
        resolve();
      });
    });
}));

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
  markdownlint(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "cr": [],
      "lf": [],
      "crlf": []
    };
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("defaultTrue", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("defaultFalse", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("defaultUndefined", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("disableRules", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("enableRules", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("enableRulesMixedCase", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("disableTag", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("enableTag", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("enableTagMixedCase", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("styleFiles", (t) => new Promise((resolve) => {
  t.plan(9);
  fs.readdir("./style", function readdir(err, files) {
    t.falsy(err);
    for (const file of files) {
      t.truthy(require(path.join("../style", file)), "Unable to load/parse.");
      const exportValue = `./style/${file}`;
      const exportKey = exportValue.replace(/\.json$/, "");
      t.is(packageExports[exportKey], exportValue);
    }
    resolve();
  });
}));

test("styleAll", (t) => new Promise((resolve) => {
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
        "MD047": [ 101 ],
        "MD048": [ 77 ],
        "MD049": [ 90 ],
        "MD050": [ 94 ],
        "MD051": [ 96 ],
        "MD052": [ 98 ],
        "MD053": [ 99 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("styleRelaxed", (t) => new Promise((resolve) => {
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
        "MD047": [ 101 ],
        "MD048": [ 77 ],
        "MD049": [ 90 ],
        "MD050": [ 94 ],
        "MD051": [ 96 ],
        "MD052": [ 98 ],
        "MD053": [ 99 ]
      }
    };
    // @ts-ignore
    t.deepEqual(actualResult, expectedResult, "Undetected issues.");
    resolve();
  });
}));

test("nullFrontMatter", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("customFrontMatter", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint({
    "strings": {
      "content": "<head>\n\t\n</head>\n# Heading\n"
    },
    "frontMatter": /<head>[\s\S]*<\/head>/,
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
    resolve();
  });
}));

test("noInlineConfig", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("readmeHeadings", (t) => new Promise((resolve) => {
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
          "##### options.markdownItPlugins",
          "##### options.noInlineConfig",
          "##### options.resultVersion",
          "##### options.strings",
          "#### callback",
          "#### result",
          "### Config",
          "#### file",
          "#### parsers",
          "#### fs",
          "#### callback",
          "#### result",
          "## Usage",
          "### Fixing",
          "## Browser",
          "## Examples",
          "## Contributing",
          "## Releasing",
          "## History"
        ]
      }
    }
  }, function callback(err, result) {
    t.falsy(err);
    const expected = { "README.md": [] };
    t.deepEqual(result, expected, "Unexpected issues.");
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
  markdownlint({ "files": files }, function callback(err) {
    t.falsy(err);
    t.deepEqual(files, expectedFiles, "Files modified.");
    resolve();
  });
}));

test("filesArrayAsString", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("missingOptions", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint(null, function callback(err, result) {
    t.falsy(err);
    t.deepEqual(
      result,
      {},
      "Did not get empty result for missing options."
    );
    resolve();
  });
}));

test("missingFilesAndStrings", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint({}, function callback(err, result) {
    t.falsy(err);
    t.truthy(result, "Did not get result for missing files/strings.");
    resolve();
  });
}));

test("missingCallback", (t) => {
  t.plan(0);
  // @ts-ignore
  markdownlint();
});

test("badFile", (t) => new Promise((resolve) => {
  t.plan(4);
  markdownlint({
    "files": [ "./badFile" ]
  }, function callback(err, result) {
    t.truthy(err, "Did not get an error for bad file.");
    t.true(err instanceof Error, "Error not instance of Error.");
    // @ts-ignore
    t.is(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    t.true(!result, "Got result for bad file.");
    resolve();
  });
}));

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

test("badFilePromise", (t) => new Promise((resolve) => {
  t.plan(3);
  markdownlint.promises.markdownlint({
    "files": [ "./badFile" ]
  }).then(
    null,
    (error) => {
      t.truthy(error, "Did not get an error for bad file.");
      t.true(error instanceof Error, "Error not instance of Error.");
      t.is(error.code, "ENOENT", "Error code for bad file not ENOENT.");
      resolve();
    }
  );
}));

test("missingStringValue", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

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

test("customFileSystemAsync", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("readme", (t) => new Promise((resolve) => {
  t.plan(125);
  const tagToRules = {};
  for (const rule of rules) {
    for (const tag of rule.tags) {
      const tagRules = tagToRules[tag] || [];
      tagRules.push(rule.names[0]);
      tagToRules[tag] = tagRules;
    }
  }
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
      for (const token of md.parse(contents, {})) {
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
              let expected = "**[" + ruleName + "](doc/" +
                ruleName.toLowerCase() + ".md)** *" +
                ruleAliases.join("/") + "* - " + rule.description;
              if (deprecatedRuleNames.has(ruleName)) {
                expected = "~~" + expected + "~~";
              }
              t.is(token.content, expected, "Rule mismatch.");
            }
          } else if (inTags) {
            const parts =
              token.content.replace(/[`*]/g, "").split(/ - |, |,\n/);
            const tag = parts.shift();
            t.deepEqual(parts, tagToRules[tag] || [],
              "Rule mismatch for tag " + tag + ".");
            delete tagToRules[tag];
          }
        }
      }
      const ruleLeft = rulesLeft.shift();
      t.true(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || "[NO RULE]").toString() + ".");
      const tagLeft = Object.keys(tagToRules).shift();
      t.true(!tagLeft, "Undocumented tag " + tagLeft + ".");
      resolve();
    });
}));

test("validateJsonUsingConfigSchemaStrict", (t) => {
  const jsonFileRe = /\.json$/i;
  const resultsFileRe = /\.results\.json$/i;
  const jsConfigFileRe = /^jsconfig\.json$/i;
  const wrongTypesFileRe = /wrong-types-in-config-file.json$/i;
  const testDirectory = __dirname;
  const testFiles = fs
    .readdirSync(testDirectory)
    .filter(function filterFile(file) {
      return jsonFileRe.test(file) &&
        !resultsFileRe.test(file) &&
        !jsConfigFileRe.test(file) &&
        !wrongTypesFileRe.test(file);
    });
  for (const file of testFiles) {
    const data = fs.readFileSync(
      path.join(testDirectory, file),
      // eslint-disable-next-line unicorn/prefer-json-parse-buffer
      "utf8"
    );
    t.true(
      // @ts-ignore
      tv4.validate(JSON.parse(data), configSchemaStrict),
      file + "\n" + JSON.stringify(tv4.error, null, 2));
  }
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
  for (const testCase of testCases) {
    t.true(
      // @ts-ignore
      tv4.validate(testCase, configSchema),
      "Unknown property blocked by default: " + JSON.stringify(testCase));
    t.false(
      // @ts-ignore
      tv4.validate(testCase, configSchemaStrict),
      "Unknown property allowed when strict: " + JSON.stringify(testCase));
  }
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
  t.plan(147);
  for (const rule of rules) {
    // @ts-ignore
    t.truthy(rule.information);
    // @ts-ignore
    t.true(Object.getPrototypeOf(rule.information) === URL.prototype);
    const name = rule.names[0].toLowerCase();
    t.is(
      // @ts-ignore
      rule.information.href,
      `${homepage}/blob/v${version}/doc/${name}.md`
    );
  }
});

test("someCustomRulesHaveValidUrl", (t) => {
  t.plan(8);
  for (const rule of customRules.all) {
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
  }
});

test("markdownItPluginsSingle", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("markdownItPluginsMultiple", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("markdownItPluginsMathjax", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("markdownItPluginsMathjaxIssue166", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("texmath test files with texmath plugin", (t) => new Promise((resolve) => {
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
    resolve();
  });
}));

test("Pandoc footnote via footnote plugin", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint({
    "strings": {
      "string":
`# Heading

Text with: [^footnote]

[^footnote]: Footnote text on multiple

    lines including a [reference][]

[reference]: https://example.com
`
    },
    "markdownItPlugins": [ [ pluginFootnote ] ],
    "resultVersion": 0
  }, (err, actual) => {
    t.falsy(err);
    const expected = { "string": {} };
    t.deepEqual(actual, expected, "Unexpected issues.");
    resolve();
  });
}));

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

test("configParsersInvalid", async(t) => {
  t.plan(1);
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
  const expected = "content: 1: MD041/first-line-heading/first-line-h1 " +
    "First line in a file should be a top-level heading [Context: \"Text\"]";
  const actual = await markdownlint.promises.markdownlint(options);
  t.is(actual.toString(), expected, "Unexpected results.");
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
  const actual = await markdownlint.promises.markdownlint(options);
  t.is(actual.toString(), "", "Unexpected results.");
});

test("configParsersJSONC", async(t) => {
  t.plan(1);
  const { "default": stripJsonComments } = await import("strip-json-comments");
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
    "configParsers": [ (content) => JSON.parse(stripJsonComments(content)) ]
  };
  const actual = await markdownlint.promises.markdownlint(options);
  t.is(actual.toString(), "", "Unexpected results.");
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
    "configParsers": [ jsYaml.load ]
  };
  const actual = await markdownlint.promises.markdownlint(options);
  t.is(actual.toString(), "", "Unexpected results.");
});

test("configParsersTOML", async(t) => {
  t.plan(1);
  const { "default": stripJsonComments } = await import("strip-json-comments");
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
      (content) => JSON.parse(stripJsonComments(content)),
      require("toml").parse
    ]
  };
  const actual = await markdownlint.promises.markdownlint(options);
  t.is(actual.toString(), "", "Unexpected results.");
});

test("getVersion", (t) => {
  t.plan(1);
  const actual = markdownlint.getVersion();
  const expected = version;
  t.is(actual, expected, "Version string not correct.");
});

test("constants", (t) => {
  t.plan(2);
  // @ts-ignore
  t.is(constants.homepage, homepage);
  // @ts-ignore
  t.is(constants.version, version);
});

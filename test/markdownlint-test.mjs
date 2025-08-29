// @ts-check

import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import path from "node:path";
import Ajv from "ajv";
import { globby } from "globby";
import jsoncParser from "jsonc-parser";
import jsYaml from "js-yaml";
import markdownIt from "markdown-it";
import pluginInline from "markdown-it-for-inline";
import pluginSub from "markdown-it-sub";
import pluginSup from "markdown-it-sup";
import test from "ava";
import { getVersion } from "markdownlint";
import { lint as lintAsync } from "markdownlint/async";
import { lint as lintPromise } from "markdownlint/promise";
import { lint as lintSync } from "markdownlint/sync";
import * as cache from "../lib/cache.mjs";
import * as constants from "../lib/constants.mjs";
import rules from "../lib/rules.mjs";
import customRules from "./rules/rules.cjs";
import { __dirname, importWithTypeJson } from "./esm-helpers.mjs";
const packageJson = await importWithTypeJson(import.meta, "../package.json");
const configSchema = await importWithTypeJson(import.meta, "../schema/markdownlint-config-schema.json");
const configSchemaStrict = await importWithTypeJson(import.meta, "../schema/markdownlint-config-schema-strict.json");

const deprecatedRuleNames = new Set(constants.deprecatedRuleNames);
const ajvOptions = {
  "allowUnionTypes": true
};

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

test("simpleAsync", (t) => new Promise((resolve) => {
  t.plan(2);
  const options = {
    "strings": {
      "content": "# Heading"
    }
  };
  const expected = "content: 1: MD047/single-trailing-newline " +
    "Files should end with a single newline character";
  lintAsync(options, (err, actual) => {
    t.falsy(err);
    // @ts-ignore
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
  const actual = lintSync(options).toString();
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
  return lintPromise(options).then((actual) => {
    t.is(actual.toString(), expected, "Unexpected results.");
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
    },
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
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
  lintAsync(options, function callback(err, actualResult) {
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
    "noInlineConfig": true,
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
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
    "noInlineConfig": true,
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
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
    "noInlineConfig": true,
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
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
      "./test/no_first_line_heading.md"
    ],
    "config": {
      "default": true,
      "MD019": false,
      "first-line-h1": false
    },
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ]
      },
      "./test/no_first_line_heading.md": {}
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
      "MD041": true,
      "default": false,
      "no-multiple-space-atx": true
    },
    "noInlineConfig": true,
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
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

test("enableRulesMixedCase", (t) => new Promise((resolve) => {
  t.plan(2);
  const options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {
      "Md041": true,
      "DeFaUlT": false,
      "nO-mUlTiPlE-sPaCe-AtX": true
    },
    "noInlineConfig": true,
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
    t.falsy(err);
    const expectedResult = {
      "./test/atx_heading_spacing.md": {
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
    "noInlineConfig": true,
    "resultVersion": 0
  };
  lintAsync(options, function callback(err, actualResult) {
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
  lintAsync(options, function callback(err, actualResult) {
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
  lintAsync(options, function callback(err, actualResult) {
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

test("styleFiles", async(t) => {
  t.plan(8);
  const files = await fs.promises.readdir("./style");
  for (const file of files) {
    t.truthy(require(path.join("../style", file)), "Unable to load/parse.");
    const exportValue = `./style/${file}`;
    const exportKey = exportValue.replace(/\.json$/, "");
    t.is(packageJson.exports[exportKey], exportValue);
  }
});

test("styleAll", async(t) => {
  t.plan(1);
  const options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/all.json"),
    "noInlineConfig": true,
    "resultVersion": 0
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
  t.deepEqual(actualResult, expectedResult, "Undetected issues.");
});

test("styleRelaxed", async(t) => {
  t.plan(1);
  const options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/relaxed.json"),
    "noInlineConfig": true,
    "resultVersion": 0
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
  t.deepEqual(actualResult, expectedResult, "Undetected issues.");
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
    },
    // @ts-ignore
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
    "noInlineConfig": true,
    // @ts-ignore
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
          "##### ~~options.resultVersion~~",
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
  lintAsync({ "files": files }, function callback(err) {
    t.falsy(err);
    t.deepEqual(files, expectedFiles, "Files modified.");
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
    t.falsy(err);
    const expected = { "README.md": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
    resolve();
  });
}));

test("missingOptions", (t) => new Promise((resolve) => {
  t.plan(2);
  lintAsync(null, function callback(err, result) {
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
  lintAsync({}, function callback(err, result) {
    t.falsy(err);
    t.truthy(result, "Did not get result for missing files/strings.");
    resolve();
  });
}));

test("missingCallback", (t) => {
  t.plan(0);
  // @ts-ignore
  lintAsync();
});

test("badFile", (t) => new Promise((resolve) => {
  t.plan(4);
  lintAsync({
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
  t.plan(3);
  lintPromise({
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
  lintAsync({
    "strings": {
      // @ts-ignore
      "undefined": undefined,
      // @ts-ignore
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
  const result = lintSync({
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
  lintAsync({
    "files": file,
    "fs": fsApi
  }, function callback(err, result) {
    t.falsy(err);
    // @ts-ignore
    t.deepEqual(result[file].length, 1, "Did not report violations.");
    resolve();
  });
}));

test("readme", async(t) => {
  t.plan(132);
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
});

test("validateJsonUsingConfigSchemaStrict", async(t) => {
  t.plan(211);
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
      t.truthy(
        result,
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
    t.truthy(
      result,
      "Unknown property blocked by default: " + JSON.stringify(validateSchema.errors, null, 2)
    );
    const resultStrict = validateSchemaStrict(testCase);
    t.falsy(
      resultStrict,
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
    t.truthy(
      validateSchema({ "property": allowed }),
      `Unknown property value ${allowed} blocked`
    );
  }
  for (const blocked of [ 2, "string" ]) {
    t.falsy(
      validateSchema({ "property": blocked }),
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
  t.is(
    configSchema.$id.replace(/^.*\/v(?<ver>\d+\.\d+\.\d+)\/.*$/u, "$<ver>"),
    packageJson.version
  );
  t.is(configSchema.$id, configSchema.properties.$schema.default);

  // Validate JSONC
  const fileJson = ".markdownlint.jsonc";
  const dataJson = fs.readFileSync(
    path.join(__dirname(import.meta), "../schema", fileJson),
    "utf8"
  );
  const jsonObject = jsoncParser.parse(dataJson);
  const result = validateSchema(jsonObject);
  t.truthy(
    result,
    `${fileJson}\n${JSON.stringify(validateSchema.errors, null, 2)}`
  );

  // Validate YAML
  const fileYaml = ".markdownlint.yaml";
  const dataYaml = fs.readFileSync(
    path.join(__dirname(import.meta), "../schema", fileYaml),
    "utf8"
  );
  const yamlObject = jsYaml.load(dataYaml);
  t.deepEqual(yamlObject, jsonObject,
    "YAML example does not match JSON example.");
});

test("allBuiltInRulesHaveValidUrl", (t) => {
  t.plan(159);
  for (const rule of rules) {
    // @ts-ignore
    t.truthy(rule.information);
    // @ts-ignore
    t.true(Object.getPrototypeOf(rule.information) === URL.prototype);
    const ruleName = rule.names[0].toLowerCase();
    t.is(
      // @ts-ignore
      rule.information.href,
      `${packageJson.homepage}/blob/v${packageJson.version}/doc/${ruleName}.md`
    );
  }
});

test("someCustomRulesHaveValidUrl", (t) => {
  t.plan(9);
  for (const rule of customRules.all) {
    t.true(!rule.information ||
      (Object.getPrototypeOf(rule.information) === URL.prototype));
    if (rule === customRules.anyBlockquote) {
      t.is(
        rule.information?.href,
        `${packageJson.homepage}/blob/main/test/rules/any-blockquote.js`
      );
    } else if (rule === customRules.lettersEX) {
      t.is(
        rule.information?.href,
        `${packageJson.homepage}/blob/main/test/rules/letters-E-X.js`
      );
    }
  }
});

test("coverageForCacheMicromarkTokensWhenUndefined", (t) => {
  t.plan(1);
  cache.initialize(undefined);
  t.is(cache.micromarkTokens().length, 0);
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
      t.true(cache.micromarkTokens().length > 0);
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
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
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
      t.true(cache.micromarkTokens().length === 0);
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
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
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
      [ pluginInline, "check_text_plugin", "text", () => t.true(true) ]
    ])
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
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
      [ pluginInline, "check_sub_plugin", "sub_open", () => t.true(true) ],
      [ pluginInline, "check_sup_plugin", "sup_open", () => t.true(true) ]
    ])
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
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
      [ pluginInline, "check_text_plugin", "text", () => t.fail() ]
    ])
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
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
      [ pluginInline, "check_text_plugin", "text", () => t.fail() ]
    ])
  }, function callback(err, actual) {
    t.falsy(err);
    const expected = { "string": [] };
    t.deepEqual(actual, expected, "Unexpected issues.");
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
    },
    // @ts-ignore
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
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "token-map-spans" ],
        "description": "token-map-spans",
        "tags": [ "tms" ],
        "parser": "markdownit",
        "function": function tokenMapSpans(params) {
          const tokenLines = [];
          let lastLineNumber = -1;
          const inlines = params.parsers.markdownit.tokens.filter(
            (c) => c.type === "inline"
          );
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
    "files": [ "./test/token-map-spans.md" ],
    "markdownItFactory": getMarkdownItFactory([])
  };
  lintSync(options);
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
  const actual = await lintPromise(options);
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
  const actual = await lintPromise(options);
  t.is(actual.toString(), "", "Unexpected results.");
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
  // @ts-ignore
  const actual = await lintPromise(options);
  t.is(actual.toString(), "", "Unexpected results.");
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
  t.is(actual.toString(), "", "Unexpected results.");
});

test("getVersion", (t) => {
  t.plan(1);
  const actual = getVersion();
  const expected = packageJson.version;
  t.is(actual, expected, "Version string not correct.");
});

test("constants", (t) => {
  t.plan(2);
  // @ts-ignore
  t.is(constants.homepage, packageJson.homepage);
  // @ts-ignore
  t.is(constants.version, packageJson.version);
});

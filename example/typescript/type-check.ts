// Attempt to validate all the type declarations in markdownlint.d.ts

import markdownlint from "../..";

const assert = require("assert");
const markdownlintJsonPath = "../../.markdownlint.json";

const version: string = markdownlint.getVersion();
assert(/^\d+\.\d+\.\d+$/.test(version));

function assertConfiguration(config: markdownlint.Configuration) {
  assert(!!config);
  assert.deepEqual(config["line-length"], { "strict": true, "code_blocks": false });
  // config assignment is covered by markdownlint.Options
}

function assertConfigurationCallback(err: Error | null, config?: markdownlint.Configuration) {
  assert(!err);
  config && assertConfiguration(config);
}

function assertLintResults(results: markdownlint.LintResults) {
  assert(!!results);
  assert.equal(results["string"].length, 1);
  assert.equal(results["string"][0].lineNumber, 1);
  assert.deepEqual(results["string"][0].ruleNames, [ "MD047", "single-trailing-newline" ]);
  assert.equal(results["string"][0].ruleDescription, "Files should end with a single newline character");
  assert.equal(results["string"][0].ruleInformation.replace(/v\d+\.\d+\.\d+/, "v0.0.0"), "https://github.com/DavidAnson/markdownlint/blob/v0.0.0/doc/md047.md");
  assert.equal(results["string"][0].errorDetail, null);
  assert.equal(results["string"][0].errorContext, null);
  assert.deepEqual(results["string"][0].errorRange, [ 9, 1 ]);
  const fixInfo = results["string"][0].fixInfo;
  assert(!!fixInfo);
  if (fixInfo) {
    assert.equal(fixInfo.lineNumber, null);
    assert.equal(fixInfo.editColumn, 10);
    assert(!fixInfo.deleteCount);
    assert.equal(fixInfo.insertText, "\n");
  }
  assert.equal(results["../bad.md"].length, 2);
  // Deliberate assignment to unused variable validates types
  // False-positive for js/useless-assignment-to-local
  results = {
    "key": [
      {
        "lineNumber": 1,
        "ruleNames": [ "rule", "names" ],
        "ruleDescription": "description",
        "ruleInformation": "https://example.com/ruleInformation",
        "errorDetail": "detail",
        "errorContext": "context",
        "errorRange": [ 1, 2 ],
        "fixInfo": {
          "editColumn": 1,
          "deleteCount": 1,
          "insertText": "text"
        }
      }
    ]
  };
}

function assertLintResultsCallback(err: Error | null, results?: markdownlint.LintResults) {
  assert(!err);
  results && assertLintResults(results);
}

assertConfiguration(markdownlint.readConfigSync(markdownlintJsonPath));
assertConfiguration(markdownlint.readConfigSync(markdownlintJsonPath, [ JSON.parse ]));

markdownlint.readConfig(markdownlintJsonPath, assertConfigurationCallback);
markdownlint.readConfig(markdownlintJsonPath, [ JSON.parse ], assertConfigurationCallback);

(async () => {
  assertConfigurationCallback(null, await markdownlint.promises.readConfig(markdownlintJsonPath));
  assertConfigurationCallback(null, await markdownlint.promises.readConfig(markdownlintJsonPath, [ JSON.parse ]))
})();

let options: markdownlint.Options;
options = {
  "files": [ "../bad.md" ],
  "strings": {
    "string": "# Heading"
  },
  "config": {
    "no-missing-space-atx": false,
    "no-hard-tabs": {
      "code_blocks": true
    }
  },
  "configParsers": [ JSON.parse ],
  "customRules": undefined,
  "frontMatter": /---/,
  "handleRuleFailures": false,
  "noInlineConfig": false,
  "markdownItPlugins": [ [ require("markdown-it-sub") ] ]
};

assertLintResults(markdownlint.sync(options));
markdownlint(options, assertLintResultsCallback);
(async () => {
  assertLintResultsCallback(null, await markdownlint.promises.markdownlint(options));
})();

options.files = "../bad.md";
assertLintResults(markdownlint.sync(options));
markdownlint(options, assertLintResultsCallback);
(async () => {
  assertLintResultsCallback(null, await markdownlint.promises.markdownlint(options));
})();

const testRule: markdownlint.Rule = {
  "names": [ "test-rule" ],
  "description": "Test rule",
  "information": new URL("https://example.com/rule-information"),
  "tags": [ "test-tag" ],
  "parser": "none",
  "function": function rule(params: markdownlint.RuleParams, onError: markdownlint.RuleOnError) {
    assert(!!params);
    assert(!!onError);
    let ruleParams: markdownlint.RuleParams;
    ruleParams = {
      "name": "name",
      "parsers": {
        "markdownit": {
          "tokens": []
        },
        "micromark": {
          "tokens": []
        }
      },
      "lines": [
        "one",
        "two"
      ],
      "frontMatterLines": [
        "three"
      ],
      "config": options.config
    };
    assert(ruleParams);
    let ruleOnErrorInfo: markdownlint.RuleOnErrorInfo;
    ruleOnErrorInfo = {
      "lineNumber": 1,
      "detail": "detail",
      "context": "context",
      "information": new URL("https://example.com/error-information"),
      "range": [ 1, 2 ],
      "fixInfo": {
        "lineNumber": 1,
        "editColumn": 1,
        "deleteCount": 1,
        "insertText": "text"
      }
    };
    assert(ruleOnErrorInfo);
    false && onError(ruleOnErrorInfo);
  }
};

options.customRules = [ testRule ];
assertLintResults(markdownlint.sync(options));
markdownlint(options, assertLintResultsCallback);
(async () => {
  assertLintResultsCallback(null, await markdownlint.promises.markdownlint(options));
})();

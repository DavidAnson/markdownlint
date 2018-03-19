"use strict";

var fs = require("fs");
var path = require("path");
var md = require("markdown-it")();
var Q = require("q");
var tv4 = require("tv4");
var markdownlint = require("../lib/markdownlint");
var shared = require("../lib/shared");
var rules = require("../lib/rules");
var customRules = require("./rules");
var defaultConfig = require("./markdownlint-test-default-config.json");
var configSchema = require("../schema/markdownlint-config-schema.json");

function createTestForFile(file) {
  return function testForFile(test) {
    test.expect(1);
    var detailedResults = /[/\\]detailed-results-/.test(file);
    var resultsFile = file.replace(/\.md$/, ".results.json");
    var configFile = file.replace(/\.md$/, ".json");
    var actualPromise = Q.nfcall(fs.stat, configFile)
      .then(
        function configFileExists() {
          return Q.nfcall(fs.readFile, configFile, shared.utf8Encoding)
            .then(JSON.parse);
        },
        function noConfigFile() {
          return {};
        })
      .then(
        function lintWithConfig(config) {
          var mergedConfig = shared.assign(shared.clone(defaultConfig), config);
          return Q.nfcall(markdownlint, {
            "files": [ file ],
            "config": mergedConfig,
            "resultVersion": detailedResults ? 2 : 0
          });
        });
    var expectedPromise = detailedResults ?
      Q.nfcall(fs.readFile, resultsFile, shared.utf8Encoding)
        .then(JSON.parse) :
      Q.nfcall(fs.readFile, file, shared.utf8Encoding)
        .then(
          function fileContents(contents) {
            var lines = contents.split(shared.newLineRe);
            var results = {};
            lines.forEach(function forLine(line, lineNum) {
              var regex = /\{(MD\d+)(?::(\d+))?\}/g;
              var match = null;
              while ((match = regex.exec(line))) {
                var rule = match[1];
                var errors = results[rule] || [];
                errors.push(match[2] ? parseInt(match[2], 10) : lineNum + 1);
                results[rule] = errors;
              }
            });
            var sortedResults = {};
            Object.keys(results).sort().forEach(function forKey(key) {
              sortedResults[key] = results[key];
            });
            return sortedResults;
          });
    Q.all([ actualPromise, expectedPromise ])
      .then(
        function compareResults(fulfillments) {
          var actual = fulfillments[0];
          var results = fulfillments[1];
          var expected = {};
          expected[file] = results;
          test.deepEqual(actual, expected, "Line numbers are not correct.");
        })
      .done(test.done, test.done);
  };
}

fs.readdirSync("./test").forEach(function forFile(file) {
  if (file.match(/\.md$/)) {
    module.exports[file] = createTestForFile(path.join("./test", file));
  }
});

module.exports.projectFiles = function projectFiles(test) {
  test.expect(2);
  var options = {
    "files": [ "README.md" ],
    "noInlineConfig": true,
    "config": {
      "MD013": { "line_length": 150 },
      "MD024": false
    }
  };
  markdownlint(options, function callback(err, actual) {
    test.ifError(err);
    var expected = { "README.md": [] };
    test.deepEqual(actual, expected, "Issue(s) with project files.");
    test.done();
  });
};

module.exports.resultFormattingV0 = function resultFormattingV0(test) {
  test.expect(4);
  var options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": defaultConfig,
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    var actualMessage = actualResult.toString();
    var expectedMessage =
      "./test/atx_heading_spacing.md: 3: MD002" +
      " First heading should be a top level heading\n" +
      "./test/atx_heading_spacing.md: 1: MD018" +
      " No space after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 3: MD019" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 5: MD019" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/first_heading_bad_atx.md: 1: MD002" +
      " First heading should be a top level heading";
    test.equal(actualMessage, expectedMessage, "Incorrect message (name).");
    actualMessage = actualResult.toString(true);
    expectedMessage =
      "./test/atx_heading_spacing.md: 3: first-heading-h1" +
      " First heading should be a top level heading\n" +
      "./test/atx_heading_spacing.md: 1: no-missing-space-atx" +
      " No space after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 3: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/atx_heading_spacing.md: 5: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading\n" +
      "./test/first_heading_bad_atx.md: 1: first-heading-h1" +
      " First heading should be a top level heading";
    test.equal(actualMessage, expectedMessage, "Incorrect message (alias).");
    test.done();
  });
};

module.exports.resultFormattingSyncV0 = function resultFormattingSyncV0(test) {
  test.expect(3);
  var options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": defaultConfig,
    "resultVersion": 0
  };
  var actualResult = markdownlint.sync(options);
  var expectedResult = {
    "./test/atx_heading_spacing.md": {
      "MD002": [ 3 ],
      "MD018": [ 1 ],
      "MD019": [ 3, 5 ]
    },
    "./test/first_heading_bad_atx.md": {
      "MD002": [ 1 ]
    }
  };
  test.deepEqual(actualResult, expectedResult, "Undetected issues.");
  var actualMessage = actualResult.toString();
  var expectedMessage =
    "./test/atx_heading_spacing.md: 3: MD002" +
    " First heading should be a top level heading\n" +
    "./test/atx_heading_spacing.md: 1: MD018" +
    " No space after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 3: MD019" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 5: MD019" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/first_heading_bad_atx.md: 1: MD002" +
    " First heading should be a top level heading";
  test.equal(actualMessage, expectedMessage, "Incorrect message (name).");
  actualMessage = actualResult.toString(true);
  expectedMessage =
    "./test/atx_heading_spacing.md: 3: first-heading-h1" +
    " First heading should be a top level heading\n" +
    "./test/atx_heading_spacing.md: 1: no-missing-space-atx" +
    " No space after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 3: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/atx_heading_spacing.md: 5: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style heading\n" +
    "./test/first_heading_bad_atx.md: 1: first-heading-h1" +
    " First heading should be a top level heading";
  test.equal(actualMessage, expectedMessage, "Incorrect message (alias).");
  test.done();
};

module.exports.resultFormattingV1 = function resultFormattingV1(test) {
  test.expect(3);
  var options = {
    "strings": {
      "truncate":
        "#  Multiple spaces inside hashes on closed atx style heading  #"
    },
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": defaultConfig,
    "resultVersion": 1
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "truncate": [
        { "lineNumber": 1,
          "ruleName": "MD021",
          "ruleAlias": "no-multiple-space-closed-atx",
          "ruleDescription":
            "Multiple spaces inside hashes on closed atx style heading",
          "errorDetail": null,
          "errorContext": "#  Multiple spa...tyle heading  #",
          "errorRange": [ 1, 4 ] }
      ],
      "./test/atx_heading_spacing.md": [
        { "lineNumber": 3,
          "ruleName": "MD002",
          "ruleAlias": "first-heading-h1",
          "ruleDescription": "First heading should be a top level heading",
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null },
        { "lineNumber": 1,
          "ruleName": "MD018",
          "ruleAlias": "no-missing-space-atx",
          "ruleDescription": "No space after hash on atx style heading",
          "errorDetail": null,
          "errorContext": "#Heading 1 {MD018}",
          "errorRange": [ 1, 2 ] },
        { "lineNumber": 3,
          "ruleName": "MD019",
          "ruleAlias": "no-multiple-space-atx",
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "errorDetail": null,
          "errorContext": "##  Heading 2 {MD019}",
          "errorRange": [ 1, 5 ] },
        { "lineNumber": 5,
          "ruleName": "MD019",
          "ruleAlias": "no-multiple-space-atx",
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "errorDetail": null,
          "errorContext": "##   Heading 3 {MD019}",
          "errorRange": [ 1, 6 ] }
      ],
      "./test/first_heading_bad_atx.md": [
        { "lineNumber": 1,
          "ruleName": "MD002",
          "ruleAlias": "first-heading-h1",
          "ruleDescription": "First heading should be a top level heading",
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    var actualMessage = actualResult.toString();
    var expectedMessage =
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style heading" +
      " [Context: \"#  Multiple spa...tyle heading  #\"]\n" +
      "./test/atx_heading_spacing.md: 3: MD002/first-heading-h1" +
      " First heading should be a top level heading" +
      " [Expected: h1; Actual: h2]\n" +
      "./test/atx_heading_spacing.md: 1: MD018/no-missing-space-atx" +
      " No space after hash on atx style heading" +
      " [Context: \"#Heading 1 {MD018}\"]\n" +
      "./test/atx_heading_spacing.md: 3: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##  Heading 2 {MD019}\"]\n" +
      "./test/atx_heading_spacing.md: 5: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##   Heading 3 {MD019}\"]\n" +
      "./test/first_heading_bad_atx.md: 1: MD002/first-heading-h1" +
      " First heading should be a top level heading" +
      " [Expected: h1; Actual: h2]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.resultFormattingV2 = function resultFormattingV2(test) {
  test.expect(3);
  var options = {
    "strings": {
      "truncate":
        "#  Multiple spaces inside hashes on closed atx style heading  #"
    },
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": defaultConfig
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "truncate": [
        { "lineNumber": 1,
          "ruleNames": [ "MD021", "no-multiple-space-closed-atx" ],
          "ruleDescription":
            "Multiple spaces inside hashes on closed atx style heading",
          "errorDetail": null,
          "errorContext": "#  Multiple spa...tyle heading  #",
          "errorRange": [ 1, 4 ] }
      ],
      "./test/atx_heading_spacing.md": [
        { "lineNumber": 3,
          "ruleNames": [ "MD002", "first-heading-h1", "first-header-h1" ],
          "ruleDescription": "First heading should be a top level heading",
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null },
        { "lineNumber": 1,
          "ruleNames": [ "MD018", "no-missing-space-atx" ],
          "ruleDescription": "No space after hash on atx style heading",
          "errorDetail": null,
          "errorContext": "#Heading 1 {MD018}",
          "errorRange": [ 1, 2 ] },
        { "lineNumber": 3,
          "ruleNames": [ "MD019", "no-multiple-space-atx" ],
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "errorDetail": null,
          "errorContext": "##  Heading 2 {MD019}",
          "errorRange": [ 1, 5 ] },
        { "lineNumber": 5,
          "ruleNames": [ "MD019", "no-multiple-space-atx" ],
          "ruleDescription": "Multiple spaces after hash on atx style heading",
          "errorDetail": null,
          "errorContext": "##   Heading 3 {MD019}",
          "errorRange": [ 1, 6 ] }
      ],
      "./test/first_heading_bad_atx.md": [
        { "lineNumber": 1,
          "ruleNames": [ "MD002", "first-heading-h1", "first-header-h1" ],
          "ruleDescription": "First heading should be a top level heading",
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    var actualMessage = actualResult.toString();
    var expectedMessage =
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style heading" +
      " [Context: \"#  Multiple spa...tyle heading  #\"]\n" +
      "./test/atx_heading_spacing.md: 3:" +
      " MD002/first-heading-h1/first-header-h1" +
      " First heading should be a top level heading" +
      " [Expected: h1; Actual: h2]\n" +
      "./test/atx_heading_spacing.md: 1: MD018/no-missing-space-atx" +
      " No space after hash on atx style heading" +
      " [Context: \"#Heading 1 {MD018}\"]\n" +
      "./test/atx_heading_spacing.md: 3: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##  Heading 2 {MD019}\"]\n" +
      "./test/atx_heading_spacing.md: 5: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style heading" +
      " [Context: \"##   Heading 3 {MD019}\"]\n" +
      "./test/first_heading_bad_atx.md: 1:" +
      " MD002/first-heading-h1/first-header-h1" +
      " First heading should be a top level heading" +
      " [Expected: h1; Actual: h2]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.stringInputLineEndings = function stringInputLineEndings(test) {
  test.expect(2);
  var options = {
    "strings": {
      "cr": "One\rTwo\r#Three",
      "lf": "One\nTwo\n#Three",
      "crlf": "One\r\nTwo\r\n#Three",
      "mixed": "One\rTwo\n#Three"
    },
    "config": defaultConfig,
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "cr": { "MD018": [ 3 ] },
      "lf": { "MD018": [ 3 ] },
      "crlf": { "MD018": [ 3 ] },
      "mixed": { "MD018": [ 3 ] }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.inputOnlyNewline = function inputOnlyNewline(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "cr": [],
      "lf": [],
      "crlf": []
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.defaultTrue = function defaultTrue(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ],
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ],
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.defaultFalse = function defaultFalse(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "./test/atx_heading_spacing.md": {},
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.defaultUndefined = function defaultUndefined(test) {
  test.expect(2);
  var options = {
    "files": [
      "./test/atx_heading_spacing.md",
      "./test/first_heading_bad_atx.md"
    ],
    "config": {},
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ],
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ],
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.disableRules = function disableRules(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableRules = function enableRules(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableRulesMixedCase = function enableRulesMixedCase(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.disableTag = function disableTag(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD002": [ 3 ],
        "MD041": [ 1 ]
      },
      "./test/first_heading_bad_atx.md": {
        "MD002": [ 1 ],
        "MD041": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableTag = function enableTag(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableTagMixedCase = function enableTagMixedCase(test) {
  test.expect(2);
  var options = {
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
    var expectedResult = {
      "./test/atx_heading_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_heading_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.styleFiles = function styleFiles(test) {
  test.expect(4);
  fs.readdir("./style", function readdir(err, files) {
    test.ifError(err);
    files.forEach(function forFile(file) {
      test.ok(require(path.join("../style", file)), "Unable to load/parse.");
    });
    test.done();
  });
};

module.exports.styleAll = function styleAll(test) {
  test.expect(2);
  var options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/all.json"),
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/break-all-the-rules.md": {
        "MD001": [ 3 ],
        "MD002": [ 1 ],
        "MD003": [ 5, 30 ],
        "MD004": [ 8 ],
        "MD005": [ 12 ],
        "MD006": [ 8 ],
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
        "MD021": [ 30 ],
        "MD022": [ 30 ],
        "MD023": [ 30 ],
        "MD024": [ 34 ],
        "MD026": [ 40 ],
        "MD027": [ 42 ],
        "MD028": [ 43 ],
        "MD029": [ 47 ],
        "MD030": [ 8 ],
        "MD031": [ 50 ],
        "MD032": [ 51 ],
        "MD033": [ 55 ],
        "MD034": [ 57 ],
        "MD035": [ 61 ],
        "MD036": [ 65 ],
        "MD037": [ 67 ],
        "MD038": [ 69 ],
        "MD039": [ 71 ],
        "MD040": [ 73 ],
        "MD041": [ 1 ],
        "MD042": [ 77 ],
        "MD045": [ 81 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.styleRelaxed = function styleRelaxed(test) {
  test.expect(2);
  var options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/relaxed.json"),
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/break-all-the-rules.md": {
        "MD001": [ 3 ],
        "MD002": [ 1 ],
        "MD003": [ 5, 30 ],
        "MD004": [ 8 ],
        "MD005": [ 12 ],
        "MD011": [ 16 ],
        "MD014": [ 23 ],
        "MD018": [ 25 ],
        "MD019": [ 27 ],
        "MD020": [ 29 ],
        "MD021": [ 30 ],
        "MD022": [ 30 ],
        "MD023": [ 30 ],
        "MD024": [ 34 ],
        "MD026": [ 40 ],
        "MD029": [ 47 ],
        "MD031": [ 50 ],
        "MD032": [ 51 ],
        "MD035": [ 61 ],
        "MD036": [ 65 ],
        "MD042": [ 77 ],
        "MD045": [ 81 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.nullFrontMatter = function nullFrontMatter(test) {
  test.expect(2);
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
    var expectedResult = {
      "content": { "MD010": [ 2 ] }
    };
    test.deepEqual(result, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.customFrontMatter = function customFrontMatter(test) {
  test.expect(2);
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
    var expectedResult = {
      "content": []
    };
    test.deepEqual(result, expectedResult, "Did not get empty results.");
    test.done();
  });
};

module.exports.noInlineConfig = function noInlineConfig(test) {
  test.expect(2);
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
        "\tTab"
      ].join("\n")
    },
    "noInlineConfig": true,
    "resultVersion": 0
  }, function callback(err, result) {
    test.ifError(err);
    var expectedResult = {
      "content": {
        "MD010": [ 3, 7, 11 ]
      }
    };
    test.deepEqual(result, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.readmeHeadings = function readmeHeadings(test) {
  test.expect(2);
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
          "##### options.noInlineConfig",
          "##### options.resultVersion",
          "#### callback",
          "#### result",
          "### Config",
          "#### file",
          "#### callback",
          "#### result",
          "## Usage",
          "## Browser",
          "## Examples",
          "## History"
        ]
      }
    }
  }, function callback(err, result) {
    test.ifError(err);
    var expected = { "README.md": [] };
    test.deepEqual(result, expected, "Unexpected issues.");
    test.done();
  });
};

module.exports.filesArrayNotModified = function filesArrayNotModified(test) {
  test.expect(2);
  var files = [
    "./test/atx_heading_spacing.md",
    "./test/first_heading_bad_atx.md"
  ];
  var expectedFiles = files.slice();
  markdownlint({ "files": files }, function callback(err) {
    test.ifError(err);
    test.deepEqual(files, expectedFiles, "Files modified.");
    test.done();
  });
};

module.exports.filesArrayAsString = function filesArrayAsString(test) {
  test.expect(2);
  markdownlint({
    "files": "README.md",
    "noInlineConfig": true,
    "config": {
      "MD013": { "line_length": 150 },
      "MD024": false
    }
  }, function callback(err, actual) {
    test.ifError(err);
    var expected = { "README.md": [] };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.done();
  });
};

module.exports.missingOptions = function missingOptions(test) {
  test.expect(2);
  markdownlint(null, function callback(err, result) {
    test.ifError(err);
    test.deepEqual(result, {}, "Did not get empty result for missing options.");
    test.done();
  });
};

module.exports.missingFilesAndStrings = function missingFilesAndStrings(test) {
  test.expect(2);
  markdownlint({}, function callback(err, result) {
    test.ifError(err);
    test.ok(result, "Did not get result for missing files/strings.");
    test.done();
  });
};

module.exports.missingCallback = function missingCallback(test) {
  test.expect(0);
  markdownlint();
  test.done();
};

module.exports.badFile = function badFile(test) {
  test.expect(4);
  markdownlint({
    "files": [ "./badFile" ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for bad file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    test.ok(!result, "Got result for bad file.");
    test.done();
  });
};

module.exports.badFileSync = function badFileSync(test) {
  test.expect(4);
  test.throws(function badFileCall() {
    markdownlint.sync({
      "files": [ "./badFile" ]
    });
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    return true;
  }, "Did not get exception for bad file.");
  test.done();
};

module.exports.missingStringValue = function missingStringValue(test) {
  test.expect(2);
  markdownlint({
    "strings": {
      "undefined": undefined,
      "null": null,
      "empty": ""
    },
    "config": defaultConfig
  }, function callback(err, result) {
    test.ifError(err);
    var expectedResult = {
      "undefined": [],
      "null": [],
      "empty": []
    };
    test.deepEqual(result, expectedResult, "Did not get empty results.");
    test.done();
  });
};

module.exports.readme = function readme(test) {
  test.expect(109);
  var tagToRules = {};
  rules.forEach(function forRule(rule) {
    rule.tags.forEach(function forTag(tag) {
      var tagRules = tagToRules[tag] || [];
      tagRules.push(rule.names[0]);
      tagToRules[tag] = tagRules;
    });
  });
  fs.readFile("README.md", shared.utf8Encoding,
    function readFile(err, contents) {
      test.ifError(err);
      var rulesLeft = rules.slice();
      var seenRelated = false;
      var seenRules = false;
      var inRules = false;
      var seenTags = false;
      var inTags = false;
      md.parse(contents, {}).forEach(function forToken(token) {
        if (token.type === "bullet_list_open") {
          if (!seenRelated) {
            seenRelated = true;
          } else if (seenRelated && !seenRules) {
            seenRules = inRules = true;
          } else if (seenRelated && seenRules && !seenTags) {
            seenTags = inTags = true;
          }
        } else if (token.type === "bullet_list_close") {
          inRules = inTags = false;
        } else if (token.type === "inline") {
          if (inRules) {
            var rule = rulesLeft.shift();
            test.ok(rule,
              "Missing rule implementation for " + token.content + ".");
            if (rule) {
              var ruleName = rule.names[0];
              var ruleAliases = rule.names.slice(1);
              var expected = "**[" + ruleName + "](doc/Rules.md#" +
                ruleName.toLowerCase() + ")** *" +
                ruleAliases.join(", ") + "* - " + rule.description;
              test.equal(token.content, expected, "Rule mismatch.");
            }
          } else if (inTags) {
            var parts = token.content.replace(/\*\*/g, "").split(/ - |, |,\n/);
            var tag = parts.shift();
            test.deepEqual(parts, tagToRules[tag] || [],
              "Rule mismatch for tag " + tag + ".");
            delete tagToRules[tag];
          }
        }
      });
      var ruleLeft = rulesLeft.shift();
      test.ok(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || "[NO RULE]").toString() + ".");
      var tagLeft = Object.keys(tagToRules).shift();
      test.ok(!tagLeft, "Undocumented tag " + tagLeft + ".");
      test.done();
    });
};

module.exports.doc = function doc(test) {
  test.expect(310);
  fs.readFile("doc/Rules.md", shared.utf8Encoding,
    function readFile(err, contents) {
      test.ifError(err);
      var rulesLeft = rules.slice();
      var inHeading = false;
      var rule = null;
      var ruleHasTags = true;
      var ruleHasAliases = true;
      var ruleUsesParams = null;
      var tagAliasParameterRe = /, |: | /;
      function testTagsAliasesParams(r) {
        r = r || "[NO RULE]";
        test.ok(ruleHasTags,
          "Missing tags for rule " + r.toString() + ".");
        test.ok(ruleHasAliases,
          "Missing aliases for rule " + r.toString() + ".");
        test.ok(!ruleUsesParams,
          "Missing parameters for rule " + r.toString() + ".");
      }
      md.parse(contents, {}).forEach(function forToken(token) {
        if ((token.type === "heading_open") && (token.tag === "h2")) {
          inHeading = true;
        } else if (token.type === "heading_close") {
          inHeading = false;
        } else if (token.type === "inline") {
          if (inHeading) {
            testTagsAliasesParams(rule);
            rule = rulesLeft.shift();
            ruleHasTags = ruleHasAliases = false;
            test.ok(rule,
              "Missing rule implementation for " + token.content + ".");
            test.equal(token.content,
              rule.names[0] + " - " + rule.description,
              "Rule mismatch.");
            ruleUsesParams = rule.function.toString()
              .match(/params\.config\.[_a-z]*/gi);
            if (ruleUsesParams) {
              ruleUsesParams = ruleUsesParams.map(function forUse(use) {
                return use.split(".").pop();
              });
            }
          } else if (/^Tags: /.test(token.content) && rule) {
            test.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.tags, "Tag mismatch for rule " + rule.toString() + ".");
            ruleHasTags = true;
          } else if (/^Aliases: /.test(token.content) && rule) {
            test.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.names.slice(1),
              "Alias mismatch for rule " + rule.toString() + ".");
            ruleHasAliases = true;
          } else if (/^Parameters: /.test(token.content) && rule) {
            var inDetails = false;
            var parameters = token.content.split(tagAliasParameterRe)
              .slice(1)
              .filter(function forPart(part) {
                inDetails = inDetails || (part[0] === "(");
                return !inDetails;
              });
            test.deepEqual(parameters, ruleUsesParams,
              "Missing parameter for rule " + rule.toString());
            ruleUsesParams = null;
          }
        }
      });
      var ruleLeft = rulesLeft.shift();
      test.ok(!ruleLeft,
        "Missing rule documentation for " +
          (ruleLeft || "[NO RULE]").toString() + ".");
      if (rule) {
        testTagsAliasesParams(rule);
      }
      test.done();
    });
};

module.exports.validateConfigSchema = function validateConfigSchema(test) {
  var jsonFileRe = /\.json$/i;
  var resultsFileRe = /\.results\.json$/i;
  var testDirectory = __dirname;
  var testFiles = fs.readdirSync(testDirectory);
  testFiles.filter(function filterFile(file) {
    return jsonFileRe.test(file) && !resultsFileRe.test(file);
  }).forEach(function forFile(file) {
    var data = fs.readFileSync(path.join(testDirectory, file));
    test.ok(
      tv4.validate(JSON.parse(data), configSchema),
      file + "\n" + JSON.stringify(tv4.error, null, 2));
  });
  test.done();
};

module.exports.clearHtmlCommentTextValid =
function clearHtmlCommentTextValid(test) {
  test.expect(1);
  var validComments = [
    "<!-- text -->",
    "<!--text-->",
    "<!-- -->",
    "<!---->",
    "<!---text-->",
    "<!--text-text-->",
    "<!--- -->",
    "<!--",
    "-->",
    "<!--",
    "",
    "-->",
    "<!--",
    "",
    "",
    "-->",
    "<!--",
    "",
    " text ",
    "",
    "-->",
    "<!--text",
    "",
    "text-->",
    "text<!--text-->text",
    "text<!--",
    "-->text",
    "text<!--",
    "text",
    "-->text",
    "<!--text--><!--text-->",
    "text<!--text-->text<!--text-->text",
    "<!--",
    "text"
  ];
  var validResult = [
    "<!--      -->",
    "<!--    -->",
    "<!-- -->",
    "<!---->",
    "<!--     -->",
    "<!--         -->",
    "<!--  -->",
    "<!--",
    "-->",
    "<!--",
    "",
    "-->",
    "<!--",
    "",
    "",
    "-->",
    "<!--",
    "",
    "     \\",
    "",
    "-->",
    "<!--   \\",
    "",
    "    -->",
    "text<!--    -->text",
    "text<!--",
    "-->text",
    "text<!--",
    "   \\",
    "-->text",
    "<!--    --><!--    -->",
    "text<!--    -->text<!--    -->text",
    "<!--",
    "    \\"
  ];
  var actual = shared.clearHtmlCommentText(validComments.join("\n"));
  var expected = validResult.join("\n");
  test.equal(actual, expected);
  test.done();
};

module.exports.clearHtmlCommentTextInvalid =
function clearHtmlCommentTextInvalid(test) {
  test.expect(1);
  var invalidComments = [
    "<!>",
    "<!->",
    "<!-->",
    "<!--->",
    "<!-->-->",
    "<!--->-->",
    "<!----->",
    "<!------>",
    "<!-- -- -->",
    "<!-->-->",
    "<!--> -->",
    "<!--->-->",
    "<!-->text-->",
    "<!--->text-->",
    "<!--text--->",
    "<!--te--xt-->"
  ];
  var actual = shared.clearHtmlCommentText(invalidComments.join("\n"));
  var expected = invalidComments.join("\n");
  test.equal(actual, expected);
  test.done();
};

module.exports.clearHtmlCommentTextNonGreedy =
function clearHtmlCommentTextNonGreedy(test) {
  test.expect(1);
  var nonGreedyComments = [
    "<!-- text --> -->",
    "<!---text --> -->",
    "<!--t--> -->",
    "<!----> -->"
  ];
  var nonGreedyResult = [
    "<!--      --> -->",
    "<!--      --> -->",
    "<!-- --> -->",
    "<!----> -->"
  ];
  var actual = shared.clearHtmlCommentText(nonGreedyComments.join("\n"));
  var expected = nonGreedyResult.join("\n");
  test.equal(actual, expected);
  test.done();
};

module.exports.clearHtmlCommentTextEmbedded =
function clearHtmlCommentTextEmbedded(test) {
  test.expect(1);
  var embeddedComments = [
    "text<!--text-->text",
    "<!-- markdownlint-disable MD010 -->",
    "text<!--text-->text",
    "text<!-- markdownlint-disable MD010 -->text",
    "text<!--text-->text"
  ];
  var embeddedResult = [
    "text<!--    -->text",
    "<!-- markdownlint-disable MD010 -->",
    "text<!--    -->text",
    "text<!-- markdownlint-disable MD010 -->text",
    "text<!--    -->text"
  ];
  var actual = shared.clearHtmlCommentText(embeddedComments.join("\n"));
  var expected = embeddedResult.join("\n");
  test.equal(actual, expected);
  test.done();
};

module.exports.trimLeftRight = function trimLeftRight(test) {
  var inputs = [
    "text text",
    " text text ",
    "   text text   ",
    // ECMAScript Whitespace
    "\u0009 text text \u0009",
    "\u000b text text \u000b",
    "\u000c text text \u000c",
    "\u0020 text text \u0020",
    "\u00a0 text text \u00a0",
    "\ufeff text text \ufeff",
    // ECMAScript LineTerminator
    "\u000a text text \u000a",
    "\u000d text text \u000d",
    "\u2028 text text \u2028",
    "\u2029 text text \u2029"
  ];
  test.expect(inputs.length * 2);
  inputs.forEach(function forInput(input) {
    test.equal(shared.trimLeft(input), input.trimLeft(),
      "trimLeft incorrect for '" + input + "'");
    test.equal(shared.trimRight(input), input.trimRight(),
      "trimRight incorrect for '" + input + "'");
  });
  test.done();
};

module.exports.configSingle = function configSingle(test) {
  test.expect(2);
  markdownlint.readConfig("./test/config-child.json",
    function callback(err, actual) {
      test.ifError(err);
      var expected = require("./config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configAbsolute = function configAbsolute(test) {
  test.expect(2);
  markdownlint.readConfig(path.join(__dirname, "config-child.json"),
    function callback(err, actual) {
      test.ifError(err);
      var expected = require("./config-child.json");
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configMultiple = function configMultiple(test) {
  test.expect(2);
  markdownlint.readConfig("./test/config-grandparent.json",
    function callback(err, actual) {
      test.ifError(err);
      var expected = shared.assign(
        shared.assign(
          shared.assign({}, require("./config-child.json")),
          require("./config-parent.json")),
        require("./config-grandparent.json"));
      delete expected.extends;
      test.deepEqual(actual, expected, "Config object not correct.");
      test.done();
    });
};

module.exports.configBadFile = function configBadFile(test) {
  test.expect(4);
  markdownlint.readConfig("./test/config/config-badfile.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad file.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
      test.ok(!result, "Got result for bad file.");
      test.done();
    });
};

module.exports.configBadChildFile = function configBadChildFile(test) {
  test.expect(4);
  markdownlint.readConfig("./test/config/config-badchildfile.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child file.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.equal(err.code, "ENOENT",
        "Error code for bad child file not ENOENT.");
      test.ok(!result, "Got result for bad child file.");
      test.done();
    });
};

module.exports.configBadJson = function configBadJson(test) {
  test.expect(3);
  markdownlint.readConfig("./test/config/config-badjson.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad JSON.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.ok(!result, "Got result for bad JSON.");
      test.done();
    });
};

module.exports.configBadChildJson = function configBadChildJson(test) {
  test.expect(3);
  markdownlint.readConfig("./test/config/config-badchildjson.json",
    function callback(err, result) {
      test.ok(err, "Did not get an error for bad child JSON.");
      test.ok(err instanceof Error, "Error not instance of Error.");
      test.ok(!result, "Got result for bad child JSON.");
      test.done();
    });
};

module.exports.configSingleSync = function configSingleSync(test) {
  test.expect(1);
  var actual = markdownlint.readConfigSync("./test/config-child.json");
  var expected = require("./config-child.json");
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configAbsoluteSync = function configAbsoluteSync(test) {
  test.expect(1);
  var actual = markdownlint.readConfigSync(
    path.join(__dirname, "config-child.json"));
  var expected = require("./config-child.json");
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configMultipleSync = function configMultipleSync(test) {
  test.expect(1);
  var actual = markdownlint.readConfigSync("./test/config-grandparent.json");
  var expected = shared.assign(
    shared.assign(
      shared.assign({}, require("./config-child.json")),
      require("./config-parent.json")),
    require("./config-grandparent.json"));
  delete expected.extends;
  test.deepEqual(actual, expected, "Config object not correct.");
  test.done();
};

module.exports.configBadFileSync = function configBadFileSync(test) {
  test.expect(4);
  test.throws(function badFileCall() {
    markdownlint.readConfigSync("./test/config-badfile.json");
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    return true;
  }, "Did not get exception for bad file.");
  test.done();
};

module.exports.configBadChildFileSync = function configBadChildFileSync(test) {
  test.expect(4);
  test.throws(function badChildFileCall() {
    markdownlint.readConfigSync("./test/config-badfile.json");
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad child file.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.code, "ENOENT", "Error code for bad child file not ENOENT.");
    return true;
  }, "Did not get exception for bad child file.");
  test.done();
};

module.exports.configBadJsonSync = function configBadJsonSync(test) {
  test.expect(3);
  test.throws(function badJsonCall() {
    markdownlint.readConfigSync("./test/config-badjson.json");
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad JSON.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    return true;
  }, "Did not get exception for bad JSON.");
  test.done();
};

module.exports.configBadChildJsonSync = function configBadChildJsonSync(test) {
  test.expect(3);
  test.throws(function badChildJsonCall() {
    markdownlint.readConfigSync("./test/config-badchildjson.json");
  }, function testError(err) {
    test.ok(err, "Did not get an error for bad child JSON.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    return true;
  }, "Did not get exception for bad child JSON.");
  test.done();
};

module.exports.customRulesV0 = function customRulesV0(test) {
  test.expect(4);
  var customRulesMd = "./test/custom-rules.md";
  var options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {};
    expectedResult[customRulesMd] = {
      "any-blockquote": [ 12 ],
      "every-n-lines": [ 2, 4, 6, 10, 12 ],
      "first-line": [ 1 ],
      "letters-E-X": [ 3, 7 ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    var actualMessage = actualResult.toString();
    var expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote" +
      " Rule that reports an error for any blockquote\n" +
      "./test/custom-rules.md: 2: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 4: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 6: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 10: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 12: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 1: first-line" +
      " Rule that reports an error for the first line\n" +
      "./test/custom-rules.md: 3: letters-E-X" +
      " Rule that reports an error for lines with the letters 'EX'\n" +
      "./test/custom-rules.md: 7: letters-E-X" +
      " Rule that reports an error for lines with the letters 'EX'";
    test.equal(actualMessage, expectedMessage, "Incorrect message (name).");
    actualMessage = actualResult.toString(true);
    expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote" +
      " Rule that reports an error for any blockquote\n" +
      "./test/custom-rules.md: 2: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 4: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 6: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 10: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 12: every-n-lines" +
      " Rule that reports an error every N lines\n" +
      "./test/custom-rules.md: 1: first-line" +
      " Rule that reports an error for the first line\n" +
      "./test/custom-rules.md: 3: letter-E-letter-X" +
      " Rule that reports an error for lines with the letters 'EX'\n" +
      "./test/custom-rules.md: 7: letter-E-letter-X" +
      " Rule that reports an error for lines with the letters 'EX'";
    test.equal(actualMessage, expectedMessage, "Incorrect message (alias).");
    test.done();
  });
};

module.exports.customRulesV1 = function customRulesV1(test) {
  test.expect(3);
  var customRulesMd = "./test/custom-rules.md";
  var options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 1
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {};
    expectedResult[customRulesMd] = [
      { "lineNumber": 12,
        "ruleName": "any-blockquote",
        "ruleAlias": "any-blockquote",
        "ruleDescription": "Rule that reports an error for any blockquote",
        "errorDetail": "Blockquote spans 1 line(s).",
        "errorContext": "> Block",
        "errorRange": null },
      { "lineNumber": 2,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 2",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 4,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 4",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 6,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 6",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 10,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 10",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 12,
        "ruleName": "every-n-lines",
        "ruleAlias": "every-n-lines",
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 12",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 1,
        "ruleName": "first-line",
        "ruleAlias": "first-line",
        "ruleDescription": "Rule that reports an error for the first line",
        "errorDetail": null,
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 3,
        "ruleName": "letters-E-X",
        "ruleAlias": "letter-E-letter-X",
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null },
      { "lineNumber": 7,
        "ruleName": "letters-E-X",
        "ruleAlias": "letter-E-letter-X",
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null }
    ];
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    var actualMessage = actualResult.toString();
    var expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote/any-blockquote" +
      " Rule that reports an error for any blockquote" +
      " [Blockquote spans 1 line(s).] [Context: \"> Block\"]\n" +
      "./test/custom-rules.md: 2: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 2]\n" +
      "./test/custom-rules.md: 4: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 4]\n" +
      "./test/custom-rules.md: 6: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 6]\n" +
      "./test/custom-rules.md: 10: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 10]\n" +
      "./test/custom-rules.md: 12: every-n-lines/every-n-lines" +
      " Rule that reports an error every N lines [Line number 12]\n" +
      "./test/custom-rules.md: 1: first-line/first-line" +
      " Rule that reports an error for the first line\n" +
      "./test/custom-rules.md: 3: letters-E-X/letter-E-letter-X" +
      " Rule that reports an error for lines with the letters 'EX'" +
      " [Context: \"text\"]\n" +
      "./test/custom-rules.md: 7: letters-E-X/letter-E-letter-X" +
      " Rule that reports an error for lines with the letters 'EX'" +
      " [Context: \"text\"]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.customRulesV2 = function customRulesV2(test) {
  test.expect(3);
  var customRulesMd = "./test/custom-rules.md";
  var options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "resultVersion": 2
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {};
    expectedResult[customRulesMd] = [
      { "lineNumber": 12,
        "ruleNames": [ "any-blockquote" ],
        "ruleDescription": "Rule that reports an error for any blockquote",
        "errorDetail": "Blockquote spans 1 line(s).",
        "errorContext": "> Block",
        "errorRange": null },
      { "lineNumber": 2,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 2",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 4,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 4",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 6,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 6",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 10,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 10",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 12,
        "ruleNames": [ "every-n-lines" ],
        "ruleDescription": "Rule that reports an error every N lines",
        "errorDetail": "Line number 12",
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 1,
        "ruleNames": [ "first-line" ],
        "ruleDescription": "Rule that reports an error for the first line",
        "errorDetail": null,
        "errorContext": null,
        "errorRange": null },
      { "lineNumber": 3,
        "ruleNames": [ "letters-E-X", "letter-E-letter-X", "contains-ex" ],
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null },
      { "lineNumber": 7,
        "ruleNames": [ "letters-E-X", "letter-E-letter-X", "contains-ex" ],
        "ruleDescription":
          "Rule that reports an error for lines with the letters 'EX'",
        "errorDetail": null,
        "errorContext": "text",
        "errorRange": null }
    ];
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    var actualMessage = actualResult.toString();
    var expectedMessage =
      "./test/custom-rules.md: 12: any-blockquote" +
      " Rule that reports an error for any blockquote" +
      " [Blockquote spans 1 line(s).] [Context: \"> Block\"]\n" +
      "./test/custom-rules.md: 2: every-n-lines" +
      " Rule that reports an error every N lines [Line number 2]\n" +
      "./test/custom-rules.md: 4: every-n-lines" +
      " Rule that reports an error every N lines [Line number 4]\n" +
      "./test/custom-rules.md: 6: every-n-lines" +
      " Rule that reports an error every N lines [Line number 6]\n" +
      "./test/custom-rules.md: 10: every-n-lines" +
      " Rule that reports an error every N lines [Line number 10]\n" +
      "./test/custom-rules.md: 12: every-n-lines" +
      " Rule that reports an error every N lines [Line number 12]\n" +
      "./test/custom-rules.md: 1: first-line" +
      " Rule that reports an error for the first line\n" +
      "./test/custom-rules.md: 3: letters-E-X/letter-E-letter-X/contains-ex" +
      " Rule that reports an error for lines with the letters 'EX'" +
      " [Context: \"text\"]\n" +
      "./test/custom-rules.md: 7: letters-E-X/letter-E-letter-X/contains-ex" +
      " Rule that reports an error for lines with the letters 'EX'" +
      " [Context: \"text\"]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.customRulesConfig = function customRulesConfig(test) {
  test.expect(2);
  var customRulesMd = "./test/custom-rules.md";
  var options = {
    "customRules": customRules.all,
    "files": [ customRulesMd ],
    "config": {
      "blockquote": true,
      "every-n-lines": {
        "n": 3
      },
      "letters-e-x": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {};
    expectedResult[customRulesMd] = {
      "any-blockquote": [ 12 ],
      "every-n-lines": [ 3, 6, 12 ],
      "first-line": [ 1 ],
      "letters-E-X": [ 7 ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.customRulesBadProperty = function customRulesBadProperty(test) {
  test.expect(76);
  [
    [ "names", [ null, "string", [], [ null ], [ "" ], [ "string", 10 ] ] ],
    [ "description", [ null, 10, "", [] ] ],
    [ "tags", [ null, "string", [], [ null ], [ "" ], [ "string", 10 ] ] ],
    [ "function", [ null, "string", [] ] ]
  ].forEach(function forProperty(property) {
    var propertyName = property[0];
    property[1].forEach(function forPropertyValue(propertyValue) {
      var badRule = shared.clone(customRules.anyBlockquote);
      badRule[propertyName] = propertyValue;
      var options = {
        "customRules": [ badRule ]
      };
      test.throws(function badRuleCall() {
        markdownlint.sync(options);
      }, function testError(err) {
        test.ok(err, "Did not get an error for missing property.");
        test.ok(err instanceof Error, "Error not instance of Error.");
        test.equal(err.message,
          "Property '" + propertyName +
            "' of custom rule at index 0 is incorrect.",
          "Incorrect message for missing property.");
        return true;
      }, "Did not get exception for missing property.");
    });
  });
  test.done();
};

module.exports.customRulesUsedNameName =
function customRulesUsedNameName(test) {
  test.expect(4);
  markdownlint({
    "customRules": [
      {
        "names": [ "name", "NO-missing-SPACE-atx" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for duplicate name.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message,
      "Name 'NO-missing-SPACE-atx' of custom rule at index 0 is " +
        "already used as a name or tag.",
      "Incorrect message for duplicate name.");
    test.ok(!result, "Got result for duplicate name.");
    test.done();
  });
};

module.exports.customRulesUsedNameTag =
function customRulesUsedNameTag(test) {
  test.expect(4);
  markdownlint({
    "customRules": [
      {
        "names": [ "name", "HtMl" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for duplicate name.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message,
      "Name 'HtMl' of custom rule at index 0 is already used as a name or tag.",
      "Incorrect message for duplicate name.");
    test.ok(!result, "Got result for duplicate name.");
    test.done();
  });
};

module.exports.customRulesUsedTagName =
function customRulesUsedTagName(test) {
  test.expect(4);
  markdownlint({
    "customRules": [
      {
        "names": [ "filler" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function noop() {}
      },
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag", "NO-missing-SPACE-atx" ],
        "function": function noop() {}
      }
    ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for duplicate tag.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message,
      "Tag 'NO-missing-SPACE-atx' of custom rule at index 1 is " +
        "already used as a name.",
      "Incorrect message for duplicate name.");
    test.ok(!result, "Got result for duplicate tag.");
    test.done();
  });
};

module.exports.customRulesThrowForFile =
function customRulesThrowForFile(test) {
  test.expect(4);
  var exceptionMessage = "Test exception message";
  markdownlint({
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function throws() {
          throw new Error(exceptionMessage);
        }
      }
    ],
    "files": [ "./test/custom-rules.md" ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for function thrown.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message, exceptionMessage,
      "Incorrect message for function thrown.");
    test.ok(!result, "Got result for function thrown.");
    test.done();
  });
};

module.exports.customRulesThrowForFileSync =
function customRulesThrowForFileSync(test) {
  test.expect(4);
  var exceptionMessage = "Test exception message";
  test.throws(function customRuleThrowsCall() {
    markdownlint.sync({
      "customRules": [
        {
          "names": [ "name" ],
          "description": "description",
          "tags": [ "tag" ],
          "function": function throws() {
            throw new Error(exceptionMessage);
          }
        }
      ],
      "files": [ "./test/custom-rules.md" ]
    });
  }, function testError(err) {
    test.ok(err, "Did not get an error for function thrown.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message, exceptionMessage,
      "Incorrect message for function thrown.");
    return true;
  }, "Did not get exception for function thrown.");
  test.done();
};

module.exports.customRulesThrowForString =
function customRulesThrowForString(test) {
  test.expect(4);
  var exceptionMessage = "Test exception message";
  markdownlint({
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function throws() {
          throw new Error(exceptionMessage);
        }
      }
    ],
    "strings": {
      "string": "String"
    }
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for function thrown.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message, exceptionMessage,
      "Incorrect message for function thrown.");
    test.ok(!result, "Got result for function thrown.");
    test.done();
  });
};

module.exports.customRulesOnErrorNull = function customRulesOnErrorNull(test) {
  test.expect(4);
  var options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function onErrorNull(params, onError) {
          onError(null);
        }
      }
    ],
    "strings": {
      "string": "String"
    }
  };
  test.throws(function badErrorCall() {
    markdownlint.sync(options);
  }, function testError(err) {
    test.ok(err, "Did not get an error for null object.");
    test.ok(err instanceof Error, "Error not instance of Error.");
    test.equal(err.message,
      "Property 'lineNumber' of onError parameter is incorrect.",
      "Incorrect message for bad object.");
    return true;
  }, "Did not get exception for null object.");
  test.done();
};

module.exports.customRulesOnErrorBad = function customRulesOnErrorBad(test) {
  test.expect(44);
  [
    [ "lineNumber", [ null, "string" ] ],
    [ "detail", [ 10, [] ] ],
    [ "context", [ 10, [] ] ],
    [ "range", [ 10, [], [ 10 ], [ 10, null ], [ 10, 11, 12 ] ] ]
  ].forEach(function forProperty(property) {
    var propertyName = property[0];
    property[1].forEach(function forPropertyValue(propertyValue) {
      var badObject = {
        "lineNumber": 1
      };
      badObject[propertyName] = propertyValue;
      var options = {
        "customRules": [
          {
            "names": [ "name" ],
            "description": "description",
            "tags": [ "tag" ],
            "function": function onErrorBad(params, onError) {
              onError(badObject);
            }
          }
        ],
        "strings": {
          "string": "String"
        }
      };
      test.throws(function badErrorCall() {
        markdownlint.sync(options);
      }, function testError(err) {
        test.ok(err, "Did not get an error for bad object.");
        test.ok(err instanceof Error, "Error not instance of Error.");
        test.equal(err.message,
          "Property '" + propertyName + "' of onError parameter is incorrect.",
          "Incorrect message for bad object.");
        return true;
      }, "Did not get exception for bad object.");
    });
  });
  test.done();
};

module.exports.customRulesOnErrorLazy = function customRulesOnErrorLazy(test) {
  test.expect(2);
  var options = {
    "customRules": [
      {
        "names": [ "name" ],
        "description": "description",
        "tags": [ "tag" ],
        "function": function onErrorNull(params, onError) {
          onError({
            "lineNumber": 1,
            "detail": "",
            "context": "",
            "range": [ 0, 0 ]
          });
        }
      }
    ],
    "strings": {
      "string": "# Heading"
    }
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "string": [
        {
          "lineNumber": 1,
          "ruleNames": [ "name" ],
          "ruleDescription": "description",
          "errorDetail": null,
          "errorContext": null,
          "errorRange": [ 0, 0 ]
        }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.customRulesDoc = function customRulesDoc(test) {
  test.expect(2);
  markdownlint({
    "files": "doc/CustomRules.md",
    "config": {
      "MD013": { "line_length": 200 }
    }
  }, function callback(err, actual) {
    test.ifError(err);
    var expected = { "doc/CustomRules.md": [] };
    test.deepEqual(actual, expected, "Unexpected issues.");
    test.done();
  });
};

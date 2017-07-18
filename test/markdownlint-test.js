"use strict";

var fs = require("fs");
var path = require("path");
var md = require("markdown-it")();
var Q = require("q");
var tv4 = require("tv4");
var markdownlint = require("../lib/markdownlint");
var shared = require("../lib/shared");
var rules = require("../lib/rules");
var polyfills = require("../demo/browser-polyfills");
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
            "resultVersion": detailedResults ? 1 : 0
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
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
    ],
    "config": defaultConfig,
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/atx_header_spacing.md": {
        "MD002": [ 3 ],
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_header_bad_atx.md": {
        "MD002": [ 1 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    var actualMessage = actualResult.toString();
    var expectedMessage =
      "./test/atx_header_spacing.md: 3: MD002" +
      " First header should be a top level header\n" +
      "./test/atx_header_spacing.md: 1: MD018" +
      " No space after hash on atx style header\n" +
      "./test/atx_header_spacing.md: 3: MD019" +
      " Multiple spaces after hash on atx style header\n" +
      "./test/atx_header_spacing.md: 5: MD019" +
      " Multiple spaces after hash on atx style header\n" +
      "./test/first_header_bad_atx.md: 1: MD002" +
      " First header should be a top level header";
    test.equal(actualMessage, expectedMessage, "Incorrect message (name).");
    actualMessage = actualResult.toString(true);
    expectedMessage =
      "./test/atx_header_spacing.md: 3: first-header-h1" +
      " First header should be a top level header\n" +
      "./test/atx_header_spacing.md: 1: no-missing-space-atx" +
      " No space after hash on atx style header\n" +
      "./test/atx_header_spacing.md: 3: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style header\n" +
      "./test/atx_header_spacing.md: 5: no-multiple-space-atx" +
      " Multiple spaces after hash on atx style header\n" +
      "./test/first_header_bad_atx.md: 1: first-header-h1" +
      " First header should be a top level header";
    test.equal(actualMessage, expectedMessage, "Incorrect message (alias).");
    test.done();
  });
};

module.exports.resultFormattingSyncV0 = function resultFormattingSyncV0(test) {
  test.expect(3);
  var options = {
    "files": [
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
    ],
    "config": defaultConfig,
    "resultVersion": 0
  };
  var actualResult = markdownlint.sync(options);
  var expectedResult = {
    "./test/atx_header_spacing.md": {
      "MD002": [ 3 ],
      "MD018": [ 1 ],
      "MD019": [ 3, 5 ]
    },
    "./test/first_header_bad_atx.md": {
      "MD002": [ 1 ]
    }
  };
  test.deepEqual(actualResult, expectedResult, "Undetected issues.");
  var actualMessage = actualResult.toString();
  var expectedMessage =
    "./test/atx_header_spacing.md: 3: MD002" +
    " First header should be a top level header\n" +
    "./test/atx_header_spacing.md: 1: MD018" +
    " No space after hash on atx style header\n" +
    "./test/atx_header_spacing.md: 3: MD019" +
    " Multiple spaces after hash on atx style header\n" +
    "./test/atx_header_spacing.md: 5: MD019" +
    " Multiple spaces after hash on atx style header\n" +
    "./test/first_header_bad_atx.md: 1: MD002" +
    " First header should be a top level header";
  test.equal(actualMessage, expectedMessage, "Incorrect message (name).");
  actualMessage = actualResult.toString(true);
  expectedMessage =
    "./test/atx_header_spacing.md: 3: first-header-h1" +
    " First header should be a top level header\n" +
    "./test/atx_header_spacing.md: 1: no-missing-space-atx" +
    " No space after hash on atx style header\n" +
    "./test/atx_header_spacing.md: 3: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style header\n" +
    "./test/atx_header_spacing.md: 5: no-multiple-space-atx" +
    " Multiple spaces after hash on atx style header\n" +
    "./test/first_header_bad_atx.md: 1: first-header-h1" +
    " First header should be a top level header";
  test.equal(actualMessage, expectedMessage, "Incorrect message (alias).");
  test.done();
};

module.exports.resultFormattingV1 = function resultFormattingV1(test) {
  test.expect(3);
  var options = {
    "strings": {
      "truncate":
        "#  Multiple spaces inside hashes on closed atx style header  #"
    },
    "files": [
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
    ],
    "config": defaultConfig
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "truncate": [
        { "lineNumber": 1,
          "ruleName": "MD021",
          "ruleAlias": "no-multiple-space-closed-atx",
          "ruleDescription":
            "Multiple spaces inside hashes on closed atx style header",
          "errorDetail": null,
          "errorContext": "#  Multiple spa...style header  #",
          "errorRange": [ 1, 4 ] }
      ],
      "./test/atx_header_spacing.md": [
        { "lineNumber": 3,
          "ruleName": "MD002",
          "ruleAlias": "first-header-h1",
          "ruleDescription": "First header should be a top level header",
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null },
        { "lineNumber": 1,
          "ruleName": "MD018",
          "ruleAlias": "no-missing-space-atx",
          "ruleDescription": "No space after hash on atx style header",
          "errorDetail": null,
          "errorContext": "#Header 1 {MD018}",
          "errorRange": [ 1, 2 ] },
        { "lineNumber": 3,
          "ruleName": "MD019",
          "ruleAlias": "no-multiple-space-atx",
          "ruleDescription": "Multiple spaces after hash on atx style header",
          "errorDetail": null,
          "errorContext": "##  Header 2 {MD019}",
          "errorRange": [ 1, 5 ] },
        { "lineNumber": 5,
          "ruleName": "MD019",
          "ruleAlias": "no-multiple-space-atx",
          "ruleDescription": "Multiple spaces after hash on atx style header",
          "errorDetail": null,
          "errorContext": "##   Header 3 {MD019}",
          "errorRange": [ 1, 6 ] }
      ],
      "./test/first_header_bad_atx.md": [
        { "lineNumber": 1,
          "ruleName": "MD002",
          "ruleAlias": "first-header-h1",
          "ruleDescription": "First header should be a top level header",
          "errorDetail": "Expected: h1; Actual: h2",
          "errorContext": null,
          "errorRange": null }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    var actualMessage = actualResult.toString();
    var expectedMessage =
      "truncate: 1: MD021/no-multiple-space-closed-atx" +
      " Multiple spaces inside hashes on closed atx style header" +
      " [Context: \"#  Multiple spa...style header  #\"]\n" +
      "./test/atx_header_spacing.md: 3: MD002/first-header-h1" +
      " First header should be a top level header" +
      " [Expected: h1; Actual: h2]\n" +
      "./test/atx_header_spacing.md: 1: MD018/no-missing-space-atx" +
      " No space after hash on atx style header" +
      " [Context: \"#Header 1 {MD018}\"]\n" +
      "./test/atx_header_spacing.md: 3: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style header" +
      " [Context: \"##  Header 2 {MD019}\"]\n" +
      "./test/atx_header_spacing.md: 5: MD019/no-multiple-space-atx" +
      " Multiple spaces after hash on atx style header" +
      " [Context: \"##   Header 3 {MD019}\"]\n" +
      "./test/first_header_bad_atx.md: 1: MD002/first-header-h1" +
      " First header should be a top level header" +
      " [Expected: h1; Actual: h2]";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
    test.done();
  });
};

module.exports.resultFormattingV1BadRegExp = function resultFormattingV1(test) {
  test.expect(3);
  var md010 = rules[8];
  test.equal(md010.name, "MD010", "Wrong rule.");
  var md010RegExp = md010.regexp;
  md010.regexp = /X/;
  var options = {
    "strings": {
      "tab": "\t."
    },
    "config": defaultConfig,
    "resultVersion": 1
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "tab": [
        { "lineNumber": 1,
          "ruleName": "MD010",
          "ruleAlias": "no-hard-tabs",
          "ruleDescription": "Hard tabs",
          "errorDetail": "Column: 1",
          "errorContext": null,
          "errorRange": null }
      ]
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    md010.regexp = md010RegExp;
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
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
    ],
    "config": {
      "default": true
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/atx_header_spacing.md": {
        "MD002": [ 3 ],
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ],
        "MD041": [ 1 ]
      },
      "./test/first_header_bad_atx.md": {
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
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
    ],
    "config": {
      "default": false
    },
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/atx_header_spacing.md": {},
      "./test/first_header_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.defaultUndefined = function defaultUndefined(test) {
  test.expect(2);
  var options = {
    "files": [
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
    ],
    "config": {},
    "resultVersion": 0
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/atx_header_spacing.md": {
        "MD002": [ 3 ],
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ],
        "MD041": [ 1 ]
      },
      "./test/first_header_bad_atx.md": {
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
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
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
      "./test/atx_header_spacing.md": {
        "MD018": [ 1 ]
      },
      "./test/first_header_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableRules = function enableRules(test) {
  test.expect(2);
  var options = {
    "files": [
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
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
      "./test/atx_header_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_header_bad_atx.md": {
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
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
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
      "./test/atx_header_spacing.md": {
        "MD002": [ 3 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_header_bad_atx.md": {
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
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
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
      "./test/atx_header_spacing.md": {
        "MD002": [ 3 ],
        "MD041": [ 1 ]
      },
      "./test/first_header_bad_atx.md": {
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
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
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
      "./test/atx_header_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_header_bad_atx.md": {}
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.enableTagMixedCase = function enableTagMixedCase(test) {
  test.expect(2);
  var options = {
    "files": [
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
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
      "./test/atx_header_spacing.md": {
        "MD018": [ 1 ],
        "MD019": [ 3, 5 ]
      },
      "./test/first_header_bad_atx.md": {}
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
        "MD042": [ 77 ]
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
        "MD042": [ 77 ]
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
      "content": "---\n\t\n---\n# Header\n"
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
      "content": "<head>\n\t\n</head>\n# Header\n"
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

module.exports.readmeHeaders = function readmeHeaders(test) {
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
        "headers": [
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
    "./test/atx_header_spacing.md",
    "./test/first_header_bad_atx.md"
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

module.exports.ruleNamesUpperCase = function ruleNamesUpperCase(test) {
  test.expect(40);
  rules.forEach(function forRule(rule) {
    test.equal(rule.name, rule.name.toUpperCase(), "Rule name not upper-case.");
  });
  test.done();
};

module.exports.uniqueAliases = function uniqueAliases(test) {
  test.expect(80);
  var tags = [];
  rules.forEach(function forRule(rule) {
    Array.prototype.push.apply(tags, rule.tags);
  });
  var aliases = [];
  rules.forEach(function forRule(rule) {
    rule.aliases.forEach(function forAlias(alias) {
      test.ok(tags.indexOf(alias) === -1, "Alias not unique in tags.");
      test.ok(aliases.indexOf(alias) === -1, "Alias not unique in aliases.");
      aliases.push(alias);
    });
  });
  test.done();
};

module.exports.readme = function readme(test) {
  test.expect(104);
  var tagToRules = {};
  rules.forEach(function forRule(rule) {
    rule.tags.forEach(function forTag(tag) {
      var tagRules = tagToRules[tag] || [];
      tagRules.push(rule.name);
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
            seenRules = true;
            inRules = true;
          } else if (seenRelated && seenRules && !seenTags) {
            seenTags = true;
            inTags = true;
          }
        } else if (token.type === "bullet_list_close") {
          inRules = false;
          inTags = false;
        } else if (token.type === "inline") {
          if (inRules) {
            var rule = rulesLeft.shift();
            test.ok(rule,
              "Missing rule implementation for " + token.content + ".");
            if (rule) {
              var expected = "**[" + rule.name + "](doc/Rules.md#" +
                rule.name.toLowerCase() + ")** *" +
                rule.aliases.join(", ") + "* - " + rule.desc;
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
        "Missing rule documentation for " + (ruleLeft || {}).name + ".");
      var tagLeft = Object.keys(tagToRules).shift();
      test.ok(!tagLeft, "Undocumented tag " + tagLeft + ".");
      test.done();
    });
};

module.exports.doc = function doc(test) {
  test.expect(303);
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
      function testTagsAliasesParams() {
        test.ok(ruleHasTags,
          "Missing tags for rule " + (rule || {}).name + ".");
        test.ok(ruleHasAliases,
          "Missing aliases for rule " + (rule || {}).name + ".");
        test.ok(!ruleUsesParams,
          "Missing parameters for rule " + (rule || {}).name + ".");
      }
      md.parse(contents, {}).forEach(function forToken(token) {
        if ((token.type === "heading_open") && (token.tag === "h2")) {
          inHeading = true;
        } else if (token.type === "heading_close") {
          inHeading = false;
        } else if (token.type === "inline") {
          if (inHeading) {
            testTagsAliasesParams();
            rule = rulesLeft.shift();
            ruleHasTags = ruleHasAliases = false;
            test.ok(rule,
              "Missing rule implementation for " + token.content + ".");
            if (rule) {
              test.equal(token.content, rule.name + " - " + rule.desc,
                "Rule mismatch.");
              ruleUsesParams = rule.func.toString()
                .match(/params\.options\.[_a-z]*/gi);
              if (ruleUsesParams) {
                ruleUsesParams = ruleUsesParams.map(function forUse(use) {
                  return use.split(".").pop();
                });
              }
            }
          } else if (/^Tags: /.test(token.content) && rule) {
            test.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.tags, "Tag mismatch for rule " + rule.name + ".");
            ruleHasTags = true;
          } else if (/^Aliases: /.test(token.content) && rule) {
            test.deepEqual(token.content.split(tagAliasParameterRe).slice(1),
              rule.aliases, "Alias mismatch for rule " + rule.name + ".");
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
              "Missing parameter for rule " + rule.name);
            ruleUsesParams = null;
          }
        }
      });
      var ruleLeft = rulesLeft.shift();
      test.ok(!ruleLeft,
        "Missing rule documentation for " + (ruleLeft || {}).name + ".");
      if (rule) {
        testTagsAliasesParams();
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

module.exports.trimPolyfills = function trimPolyfills(test) {
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
    test.equal(polyfills.trimLeftPolyfill.call(input), input.trimLeft(),
      "trimLeft incorrect for '" + input + "'");
    test.equal(polyfills.trimRightPolyfill.call(input), input.trimRight(),
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

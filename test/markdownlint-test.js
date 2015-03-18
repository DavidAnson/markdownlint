"use strict";

var fs = require("fs");
var path = require("path");
var Q = require("q");
var markdownlint = require("../lib/markdownlint");
var shared = require("../lib/shared");

function createTestForFile(file) {
  return function testForFile(test) {
    test.expect(1);
    var configFile = file.replace(/\.md$/, ".json");
    var actualPromise = Q.nfcall(fs.stat, configFile)
      .then(
        function configFileExists() {
          return Q.nfcall(fs.readFile, configFile, shared.utf8Encoding)
            .then(
              function configFileContents(contents) {
                return JSON.parse(contents);
              });
        },
        function noConfigFile() {
          return null;
        })
      .then(
        function lintWithConfig(config) {
          return Q.nfcall(markdownlint, {
            "files": [ file ],
            "config": config
          });
        });
    var expectedPromise = Q.nfcall(fs.readFile, file, shared.utf8Encoding)
      .then(
        function fileContents(contents) {
          var lines = contents.split(shared.newLineRe);
          var results = {};
          lines.forEach(function forLine(line, lineNum) {
            var regex = /\{(MD\d+)(?::(\d+))?\}/g;
            var match;
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

/* eslint-disable no-sync, for synchronous test method creation */
fs.readdirSync(__dirname).forEach(function forFile(file) {
/* eslint-enable no-sync */
  if (file.match(/\.md$/)) {
    module.exports[file] = createTestForFile(path.join(__dirname, file));
  }
});

module.exports.projectFiles = function projectFiles(test) {
  test.expect(2);
  var options = {
    "files": [ "README.md" ]
  };
  markdownlint(options, function callback(err, actual) {
    test.ifError(err);
    var expected = { "README.md": {} };
    test.deepEqual(actual, expected, "Issue(s) with project files.");
    test.done();
  });
};

module.exports.resultFormatting = function resultFormatting(test) {
  test.expect(3);
  var options = {
    "files": [
      "./test/atx_header_spacing.md",
      "./test/first_header_bad_atx.md"
    ]
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
      " First header should be a h1 header\n" +
      "./test/atx_header_spacing.md: 1: MD018" +
      " No space after hash on atx style header\n" +
      "./test/atx_header_spacing.md: 3: MD019" +
      " Multiple spaces after hash on atx style header\n" +
      "./test/atx_header_spacing.md: 5: MD019" +
      " Multiple spaces after hash on atx style header\n" +
      "./test/first_header_bad_atx.md: 1: MD002" +
      " First header should be a h1 header";
    test.equal(actualMessage, expectedMessage, "Incorrect message.");
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
    }
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
    }
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
      "MD019": false
    }
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
      "MD019": true
    }
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
    }
  };
  markdownlint(options, function callback(err, actualResult) {
    test.ifError(err);
    var expectedResult = {
      "./test/atx_header_spacing.md": {
        "MD002": [ 3 ]
      },
      "./test/first_header_bad_atx.md": {
        "MD002": [ 1 ]
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
      "spaces": true
    }
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

module.exports.styleAll = function styleAll(test) {
  test.expect(2);
  var options = {
    "files": [ "./test/break-all-the-rules.md" ],
    "config": require("../style/all.json")
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
        "MD032": [ 51 ]
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
    "config": require("../style/relaxed.json")
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
        "MD032": [ 51 ]
      }
    };
    test.deepEqual(actualResult, expectedResult, "Undetected issues.");
    test.done();
  });
};

module.exports.filesNotModified = function filesNotModified(test) {
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

module.exports.missingOptions = function missingOptions(test) {
  test.expect(2);
  markdownlint(null, function callback(err, result) {
    test.ifError(err);
    test.ok(result, "Did not get result for missing options.");
    test.done();
  });
};

module.exports.missingFiles = function missingFiles(test) {
  test.expect(2);
  markdownlint({}, function callback(err, result) {
    test.ifError(err);
    test.ok(result, "Did not get result for missing files.");
    test.done();
  });
};

module.exports.missingCallback = function missingCallback(test) {
  test.expect(0);
  markdownlint();
  test.done();
};

module.exports.badFile = function badFile(test) {
  test.expect(3);
  markdownlint({
    "files": [ "./badFile" ]
  }, function callback(err, result) {
    test.ok(err, "Did not get an error for bad file.");
    test.equal(err.code, "ENOENT", "Error code for bad file not ENOENT.");
    test.ok(!result, "Got result for bad file.");
    test.done();
  });
};

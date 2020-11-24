// @ts-check

"use strict";

const { existsSync } = require("fs");
const { join } = require("path");
const { promisify } = require("util");
const globby = require("globby");
const jsYaml = require("js-yaml");
const stripJsonComments = require("strip-json-comments");
const tape = require("tape");
require("tape-player");
const markdownlint = require("../lib/markdownlint");
const markdownlintPromise = promisify(markdownlint);
const readConfigPromise = promisify(markdownlint.readConfig);

/**
 * Parses JSONC text.
 *
 * @param {string} json JSON to parse.
 * @returns {Object} Object representation.
 */
function jsoncParse(json) {
  return JSON.parse(stripJsonComments(json));
}

/**
 * Parses YAML text.
 *
 * @param {string} yaml YAML to parse.
 * @returns {Object} Object representation.
 */
function yamlParse(yaml) {
  return jsYaml.safeLoad(yaml);
}

/**
 * Lints a test repository.
 *
 * @param {Object} test Test instance.
 * @param {string[]} globPatterns Array of files to in/exclude.
 * @param {string} configPath Path to config file.
 */
function lintTestRepo(test, globPatterns, configPath) {
  test.plan(1);
  Promise.all([
    globby(globPatterns),
    // @ts-ignore
    readConfigPromise(configPath, [ jsoncParse, yamlParse ])
  ]).then((globbyAndReadConfigResults) => {
    const [ files, config ] = globbyAndReadConfigResults;
    const options = {
      files,
      config
    };
    return markdownlintPromise(options).then((results) => {
      const resultsString = results.toString();
      if (resultsString.length > 0) {
        // eslint-disable-next-line no-console
        console.log(resultsString);
      }
      test.ok(!resultsString.length, "Unexpected linting violations");
      test.end();
    });
  });
}

// Run markdownlint the same way the corresponding repositories do

tape("https://github.com/eslint/eslint", (test) => {
  const rootDir = "./test-repos/eslint-eslint";
  const globPatterns = [ join(rootDir, "docs/**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.yml");
  lintTestRepo(test, globPatterns, configPath);
});

tape("https://github.com/mkdocs/mkdocs", (test) => {
  const rootDir = "./test-repos/mkdocs-mkdocs";
  const globPatterns = [
    join(rootDir, "README.md"),
    join(rootDir, "CONTRIBUTING.md"),
    join(rootDir, "docs/*"),
    "!" + join(rootDir, "docs/CNAME")
  ];
  const configPath = join(rootDir, ".markdownlintrc");
  lintTestRepo(test, globPatterns, configPath);
});

tape("https://github.com/pi-hole/docs", (test) => {
  const rootDir = "./test-repos/pi-hole-docs";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.json");
  lintTestRepo(test, globPatterns, configPath);
});

// Optional repositories (very large)

const dotnetDocsDir = "./test-repos/dotnet-docs";
if (existsSync(dotnetDocsDir)) {
  tape("https://github.com/dotnet/docs", (test) => {
    const rootDir = dotnetDocsDir;
    const globPatterns = [
      join(rootDir, "**/*.md"),
      "!" + join(rootDir, "samples/**/*.md"),
      // A table parsing change in markdown-it v12 causes a new issue here
      "!" + join(
        rootDir,
        "docs/standard/base-types/" +
        "regular-expression-example-scanning-for-hrefs.md"
      )
    ];
    const configPath = join(rootDir, ".markdownlint.json");
    lintTestRepo(test, globPatterns, configPath);
  });
}

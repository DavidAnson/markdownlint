// @ts-check

"use strict";

const { existsSync } = require("fs");
// eslint-disable-next-line unicorn/import-style
const { join } = require("path");
const { promisify } = require("util");
const globby = require("globby");
const jsYaml = require("js-yaml");
const stripJsonComments = require("strip-json-comments");
const test = require("ava").default;
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
  return jsYaml.load(yaml);
}

/**
 * Lints a test repository.
 *
 * @param {Object} t Test instance.
 * @param {string[]} globPatterns Array of files to in/exclude.
 * @param {string} configPath Path to config file.
 * @returns {Promise} Test result.
 */
function lintTestRepo(t, globPatterns, configPath) {
  t.plan(1);
  return Promise.all([
    globby(globPatterns),
    // @ts-ignore
    readConfigPromise(configPath, [ jsoncParse, yamlParse ])
  ]).then((globbyAndReadConfigResults) => {
    const [ files, config ] = globbyAndReadConfigResults;
    const options = {
      files,
      config
    };
    // eslint-disable-next-line no-console
    console.log(`${t.title}: Linting ${files.length} files...`);
    return markdownlintPromise(options).then((results) => {
      const resultsString = results.toString();
      if (resultsString.length > 0) {
        // eslint-disable-next-line no-console
        console.log(resultsString);
      }
      t.is(resultsString.length, 0, "Unexpected linting violations");
    });
  });
}

// Run markdownlint the same way the corresponding repositories do

test("https://github.com/eslint/eslint", (t) => {
  const rootDir = "./test-repos/eslint-eslint";
  const globPatterns = [ join(rootDir, "docs/**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.yml");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/mkdocs/mkdocs", (t) => {
  const rootDir = "./test-repos/mkdocs-mkdocs";
  const globPatterns = [
    join(rootDir, "README.md"),
    join(rootDir, "CONTRIBUTING.md"),
    join(rootDir, "docs/**/*.md"),
    "!" + join(rootDir, "docs/CNAME")
  ];
  const configPath = join(rootDir, ".markdownlintrc");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/mochajs/mocha", (t) => {
  const rootDir = "./test-repos/mochajs-mocha";
  const globPatterns = [
    join(rootDir, "*.md"),
    join(rootDir, "docs/**/*.md"),
    join(rootDir, ".github/*.md"),
    join(rootDir, "lib/**/*.md"),
    join(rootDir, "test/**/*.md"),
    join(rootDir, "example/**/*.md")
  ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/pi-hole/docs", (t) => {
  const rootDir = "./test-repos/pi-hole-docs";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/webhintio/hint", (t) => {
  const rootDir = "./test-repos/webhintio-hint";
  const globPatterns = [
    join(rootDir, "**/*.md"),
    "!" + join(rootDir, "**/CHANGELOG.md")
  ];
  const configPath = join(rootDir, ".markdownlintrc");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/webpack/webpack.js.org", (t) => {
  const rootDir = "./test-repos/webpack-webpack-js-org";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});

// Optional repositories (very large)

const dotnetDocsDir = "./test-repos/dotnet-docs";
if (existsSync(dotnetDocsDir)) {
  test("https://github.com/dotnet/docs", (t) => {
    const rootDir = dotnetDocsDir;
    const globPatterns = [
      join(rootDir, "**/*.md"),
      "!" + join(rootDir, "samples/**/*.md")
    ];
    const configPath = join(rootDir, ".markdownlint.json");
    return lintTestRepo(t, globPatterns, configPath);
  });
}

const v8v8DevDir = "./test-repos/v8-v8-dev";
if (existsSync(v8v8DevDir)) {
  test("https://github.com/v8/v8.dev", (t) => {
    const rootDir = v8v8DevDir;
    const globPatterns = [ join(rootDir, "src/**/*.md") ];
    const configPath = join(rootDir, ".markdownlint.json");
    return lintTestRepo(t, globPatterns, configPath);
  });
}

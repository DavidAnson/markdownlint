// @ts-check

"use strict";

const { existsSync } = require("fs");
// eslint-disable-next-line unicorn/import-style
const { join } = require("path");
const { promisify } = require("util");
const jsYaml = require("js-yaml");
const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");
const markdownlintPromise = promisify(markdownlint);
const readConfigPromise = promisify(markdownlint.readConfig);

/**
 * Lints a test repository.
 *
 * @param {Object} t Test instance.
 * @param {string[]} globPatterns Array of files to in/exclude.
 * @param {string} configPath Path to config file.
 * @param {RegExp[]} [ignoreRes] Array of RegExp violations to ignore.
 * @returns {Promise} Test result.
 */
async function lintTestRepo(t, globPatterns, configPath, ignoreRes) {
  t.plan(1);
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const { globby } = await import("globby");
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const { "default": stripJsonComments } = await import("strip-json-comments");
  const jsoncParse = (json) => JSON.parse(stripJsonComments(json));
  const yamlParse = (yaml) => jsYaml.load(yaml);
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
      let resultsString = results.toString();
      for (const ignoreRe of (ignoreRes || [])) {
        const lengthBefore = resultsString.length;
        resultsString = resultsString.replace(ignoreRe, "");
        if (resultsString.length === lengthBefore) {
          t.fail(`Unnecessary ignore: ${ignoreRe}`);
        }
      }
      if (resultsString.length > 0) {
        // eslint-disable-next-line no-console
        console.log(resultsString);
      }
      t.is(resultsString.length, 0, "Unexpected linting violations");
    });
  });
}

/**
 * Excludes a list of globs.
 *
 * @param {string} rootDir Root directory for globs.
 * @param {...string} globs Globs to exclude.
 * @returns {string[]} Array of excluded globs.
 */
function excludeGlobs(rootDir, ...globs) {
  return globs.map((glob) => "!" + join(rootDir, glob));
}

// Run markdownlint the same way the corresponding repositories do

test("https://github.com/eslint/eslint", (t) => {
  const rootDir = "./test-repos/eslint-eslint";
  const globPatterns = [ join(rootDir, "docs/**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.yml");
  const ignoreRes =
    [ /^[^:]+\/array-callback-return\.md: \d+: MD050\/.*$\r?\n?/gm ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/mkdocs/mkdocs", (t) => {
  const rootDir = "./test-repos/mkdocs-mkdocs";
  const globPatterns = [
    join(rootDir, "README.md"),
    join(rootDir, "CONTRIBUTING.md"),
    join(rootDir, "docs"),
    ...excludeGlobs(
      rootDir,
      "docs/CNAME",
      "docs/**/*.css",
      "docs/**/*.png"
    )
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
  const ignoreRes =
    [ /^[^:]+\/(unbound|index|prerequisites)\.md: \d+: MD049\/.*$\r?\n?/gm ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/webhintio/hint", (t) => {
  const rootDir = "./test-repos/webhintio-hint";
  const globPatterns = [
    join(rootDir, "**/*.md"),
    ...excludeGlobs(rootDir, "**/CHANGELOG.md")
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
    const globPatterns = [ join(rootDir, "**/*.md") ];
    const configPath = join(rootDir, ".markdownlint.json");
    const ignoreRes = [ /^[^:]+: \d+: (MD049|MD050)\/.*$\r?\n?/gm ];
    return lintTestRepo(t, globPatterns, configPath, ignoreRes);
  });
}

const v8v8DevDir = "./test-repos/v8-v8-dev";
if (existsSync(v8v8DevDir)) {
  test("https://github.com/v8/v8.dev", (t) => {
    const rootDir = v8v8DevDir;
    const globPatterns = [ join(rootDir, "src/**/*.md") ];
    const configPath = join(rootDir, ".markdownlint.json");
    const ignoreRes = [ /^[^:]+: \d+: MD049\/.*$\r?\n?/gm ];
    return lintTestRepo(t, globPatterns, configPath, ignoreRes);
  });
}

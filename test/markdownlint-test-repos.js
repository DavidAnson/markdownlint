// @ts-check

"use strict";

const { join } = require("node:path").posix;
const jsoncParser = require("jsonc-parser");
const jsYaml = require("js-yaml");
const { markdownlint, readConfig } = require("../lib/markdownlint").promises;
const markdownlintParallel = require("./markdownlint-test-parallel");

/**
 * Lints a test repository.
 *
 * @param {Object} t Test instance.
 * @param {string[]} globPatterns Array of files to in/exclude.
 * @param {string} configPath Path to config file.
 * @param {boolean} [parallel] True to lint in parallel.
 * @returns {Promise} Test result.
 */
async function lintTestRepo(t, globPatterns, configPath, parallel) {
  t.plan(1);
  const { globby } = await import("globby");
  const jsoncParse = (json) => {
    const config = jsoncParser.parse(json, [], { "allowTrailingComma": true });
    return config.config || config;
  };
  const yamlParse = (yaml) => jsYaml.load(yaml);
  return Promise.all([
    globby(globPatterns),
    readConfig(configPath, [ jsoncParse, yamlParse ])
  ]).then((globbyAndReadConfigResults) => {
    const [ files, rawConfig ] = globbyAndReadConfigResults;
    // eslint-disable-next-line no-console
    console.log(`${t.title}: Linting ${files.length} files...`);
    const config = Object.fromEntries(
      Object.entries(rawConfig).
        map(([ k, v ]) => [
          k.replace(/header/, "heading"),
          v
        ])
    );
    return (parallel ? markdownlintParallel : markdownlint)({
      files,
      config
    }).then((results) => {
      const resultsString = results.toString();
      t.snapshot(
        resultsString,
        "Expected linting violations"
      );
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

module.exports = {
  excludeGlobs,
  lintTestRepo
};

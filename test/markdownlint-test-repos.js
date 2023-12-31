// @ts-check

"use strict";

const { join } = require("node:path").posix;
const jsYaml = require("js-yaml");
const markdownlint = require("../lib/markdownlint");

/**
 * Lints a test repository.
 *
 * @param {Object} t Test instance.
 * @param {string[]} globPatterns Array of files to in/exclude.
 * @param {string} configPath Path to config file.
 * @returns {Promise} Test result.
 */
async function lintTestRepo(t, globPatterns, configPath) {
  t.plan(1);
  const { globby } = await import("globby");
  const { "default": stripJsonComments } = await import("strip-json-comments");
  const jsoncParse = (json) => {
    const config = JSON.parse(stripJsonComments(json));
    return config.config || config;
  };
  const yamlParse = (yaml) => jsYaml.load(yaml);
  return Promise.all([
    globby(globPatterns),
    markdownlint.promises.readConfig(configPath, [ jsoncParse, yamlParse ])
  ]).then((globbyAndReadConfigResults) => {
    const [ files, rawConfig ] = globbyAndReadConfigResults;
    // eslint-disable-next-line no-console
    console.log(`${t.title}: Linting ${files.length} files...`);
    const config = Object.fromEntries(
      Object.entries(rawConfig).
        map(([ k, v ]) => [
          k.replace(/header/, "heading"),
          typeof v === "object" ?
            Object.fromEntries(
              // @ts-ignore
              Object.entries(v).
                map(([ kk, vv ]) => [ kk.replace(/^allow_different_nesting$/, "siblings_only"), vv ])
              ) :
            v
        ])
    );
    return markdownlint.promises.markdownlint({
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

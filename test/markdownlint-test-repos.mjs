// @ts-check

import path from "node:path";
const { join } = path.posix;
import { globby } from "globby";
import jsoncParser from "jsonc-parser";
import jsYaml from "js-yaml";
import { formatLintResults } from "markdownlint/helpers";
import { lint, readConfig } from "markdownlint/promise";
import { markdownlintParallel } from "./markdownlint-test-parallel.mjs";

/** @typedef {import("markdownlint").Configuration} Configuration */

/**
 * Lints a test repository.
 *
 * @param {import("ava").ExecutionContext<unknown>} t Test instance.
 * @param {string[]} globPatterns Array of files to in/exclude.
 * @param {string} configPath Path to config file.
 * @param {Configuration} [configOverrides] Configuration overrides.
 * @param {boolean} [parallel] True to lint in parallel.
 * @returns {Promise<void>} Test result.
 */
export function lintTestRepo(t, globPatterns, configPath, configOverrides, parallel) {
  t.plan(1);
  const jsoncParse = (/** @type {string} */ json) => {
    const config = jsoncParser.parse(json, [], { "allowTrailingComma": true });
    return config.config || config;
  };
  const yamlParse = (/** @type {string} */ yaml) => jsYaml.load(yaml);
  return Promise.all([
    globby(globPatterns),
    readConfig(configPath, [ jsoncParse, yamlParse ])
  ]).then((globbyAndReadConfigResults) => {
    const [ files, rawConfig ] = globbyAndReadConfigResults;
    // eslint-disable-next-line no-console
    console.log(`${t.title}: Linting ${files.length} files...`);
    const cookedConfig = Object.fromEntries(
      Object.entries(rawConfig)
        .map(([ k, v ]) => [
          k.replace(/header/, "heading"),
          v
        ])
    );
    const config = {
      ...cookedConfig,
      ...configOverrides
    };
    return (parallel ? markdownlintParallel : lint)({
      files,
      config
    }).then((results) => {
      t.snapshot(
        formatLintResults(results).join("\n"),
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
export function excludeGlobs(rootDir, ...globs) {
  return globs.map((glob) => "!" + join(rootDir, glob));
}

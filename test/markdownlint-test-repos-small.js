// @ts-check

"use strict";

const { join } = require("node:path").posix;
const test = require("ava").default;
const { excludeGlobs, lintTestRepo } = require("./markdownlint-test-repos");

// Run markdownlint the same way the corresponding repositories do

test("https://github.com/apache/airflow", (t) => {
  const rootDir = "./test-repos/apache-airflow";
  const globPatterns = [ join(rootDir, "**/*.{md,mdown,markdown}") ];
  const configPath = join(rootDir, ".markdownlint.yml");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/electron/electron", (t) => {
  const rootDir = "./test-repos/electron-electron";
  const globPatterns = [
    join(rootDir, "*.md"),
    join(rootDir, "docs/**/*.md")
  ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});

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
    join(rootDir, "docs"),
    ...excludeGlobs(
      rootDir,
      "docs/CNAME",
      "docs/**/*.css",
      "docs/**/*.png",
      "docs/**/*.py",
      "docs/**/*.svg"
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
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/v8/v8.dev", (t) => {
  const rootDir = "./test-repos/v8-v8-dev";
  const globPatterns = [ join(rootDir, "src/**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
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

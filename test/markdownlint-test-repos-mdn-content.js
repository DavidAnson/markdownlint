// @ts-check

"use strict";

const { join } = require("node:path").posix;
const test = require("ava").default;
const { lintTestRepo } = require("./markdownlint-test-repos");

test("https://github.com/mdn/content", (t) => {
  const rootDir = "./test-repos/mdn-content";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint-cli2.jsonc");
  return lintTestRepo(t, globPatterns, configPath);
});

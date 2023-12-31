// @ts-check

"use strict";

const { join } = require("node:path").posix;
const test = require("ava").default;
const { lintTestRepo } = require("./markdownlint-test-repos");

test("https://github.com/dotnet/docs", (t) => {
  const rootDir = "./test-repos/dotnet-docs";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint-cli2.jsonc");
  return lintTestRepo(t, globPatterns, configPath);
});

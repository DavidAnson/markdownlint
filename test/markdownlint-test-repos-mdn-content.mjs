// @ts-check

import path from "node:path";
const { join } = path.posix;
import test from "ava";
import { lintTestRepo } from "./markdownlint-test-repos.mjs";

test("https://github.com/mdn/content", (t) => {
  const rootDir = "./test-repos/mdn-content";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint-cli2.jsonc");
  return lintTestRepo(t, globPatterns, configPath, { "table-column-style": false }, true);
});

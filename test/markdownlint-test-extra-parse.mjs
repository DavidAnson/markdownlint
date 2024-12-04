// @ts-check

import test from "ava";
import { globby } from "globby";
import { lint } from "markdownlint/promise";

// Parses all Markdown files in all package dependencies
test("parseAllFiles", async(t) => {
  t.plan(1);
  const files = await globby("**/*.{md,markdown}");
  await lint({ files });
  t.pass();
});

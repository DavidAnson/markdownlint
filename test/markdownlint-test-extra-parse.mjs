// @ts-check

import test from "ava";
import { globby } from "globby";
import markdownlint from "../lib/markdownlint.mjs";

// Parses all Markdown files in all package dependencies
test("parseAllFiles", async(t) => {
  t.plan(1);
  const files = await globby("**/*.{md,markdown}");
  await markdownlint.promises.markdownlint({ files });
  t.pass();
});

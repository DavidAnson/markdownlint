// @ts-check

"use strict";

const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");

// Parses all Markdown files in all package dependencies
test("parseAllFiles", async(t) => {
  t.plan(1);
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const { globby } = await import("globby");
  const files = await globby("**/*.{md,markdown}");
  await markdownlint.promises.markdownlint({ files });
  t.pass();
});

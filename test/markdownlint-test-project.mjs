// @ts-check

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import test from "ava";
import { globby } from "globby";
import { lint as lintPromise } from "markdownlint/promise";

const projectFiles = [
  "*.md",
  "doc/*.md",
  "helpers/*.md",
  "micromark/*.md",
  "schema/*.md"
];
const files = await globby(projectFiles);

test("projectFiles", (t) => {
  t.plan(2);
  t.is(files.length, 62);
  const options = {
    files,
    "config": require("../.markdownlint.json")
  };
  return lintPromise(options).then((actual) => {
    const expected = {};
    for (const file of files) {
      expected[file] = [];
    }
    t.deepEqual(actual, expected, "Issue(s) with project files.");
  });
});

test("projectFilesExtendedAscii", (t) => {
  t.plan(2);
  const ignoreFiles = new Set([
    "doc/Rules.md",
    "doc/md010.md",
    "doc/md026.md",
    "doc/md036.md"
  ]);
  const filteredFiles = files.filter((file) => !ignoreFiles.has(file));
  t.is(filteredFiles.length, 58);
  const options = {
    "files": filteredFiles,
    "config": require("../.markdownlint.json"),
    "customRules": [ require("markdownlint-rule-extended-ascii") ]
  };
  return lintPromise(options).then((actual) => {
    const expected = {};
    for (const file of filteredFiles) {
      expected[file] = [];
    }
    t.deepEqual(actual, expected, "Issue(s) with project files.");
  });
});

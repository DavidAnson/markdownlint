// @ts-check

import fs from "node:fs";
import path from "node:path";
import test from "ava";
import { lint } from "markdownlint/sync";

// Simulates typing each test file to validate handling of partial input
const files = fs
  .readdirSync("./test")
  .filter((file) => /\.md$/.test(file));
for (const file of files) {
  const strings = {};
  let content = fs.readFileSync(path.join("./test", file), "utf8");
  while (content) {
    strings[content.length.toString()] = content;
    content = content.slice(0, -1);
  }
  test.serial(`type ${file}`, (t) => {
    t.plan(1);
    lint({
      // @ts-ignore
      strings,
      "resultVersion": 0
    });
    t.pass();
  });
}

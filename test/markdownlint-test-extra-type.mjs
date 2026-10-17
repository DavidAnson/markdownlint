// @ts-check

import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { lint } from "markdownlint/sync";

const dirfiles = await fs.readdir("./test");
const files = dirfiles.filter((file) => /\.md$/.test(file));

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  // Simulates typing each test file to validate handling of partial input
  for (const file of files) {
    test(`type ${file}`, async(t) => {
      t.plan(1);
      let content = await fs.readFile(path.join("./test", file), "utf8");
      while (content) {
        let batchSize = 0;
        /** @type {Object.<string, string>} */
        const strings = {};
        while (content && (batchSize < 1000)) {
          strings[content.length.toString()] = content;
          content = content.slice(0, -1);
          batchSize++;
        }
        lint({ strings });
      }
      // @ts-ignore
      t.assert.ok(true);
    });
  }

});

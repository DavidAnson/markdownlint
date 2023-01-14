import { readFile } from "node:fs/promises";
import library from "../lib/markdownlint.js";
const markdownlint = library.promises.markdownlint;

const strings = {
  "CHANGELOG": await readFile("CHANGELOG.md", "utf8"),
  "CONTRIBUTING": await readFile("CONTRIBUTING.md", "utf8"),
  "README": await readFile("README.md", "utf8"),
  "CustomRules": await readFile("./doc/CustomRules.md", "utf8"),
  "Prettier": await readFile("./doc/Prettier.md", "utf8"),
  "Rules": await readFile("./doc/Rules.md", "utf8")
};

const start = new Date();
for (let i = 0; i < 250; i++) {
  // eslint-disable-next-line no-await-in-loop
  await markdownlint({ strings });
}
const end = new Date();
// eslint-disable-next-line no-console
console.log(`Elapsed: ${end - start}`);

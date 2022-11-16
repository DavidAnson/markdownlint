import library from "../lib/markdownlint.js";
const markdownlint = library.promises.markdownlint;

const results = await markdownlint({
  "files": process.argv.slice(2)
});
// eslint-disable-next-line no-console
console.dir(results, { "depth": null });

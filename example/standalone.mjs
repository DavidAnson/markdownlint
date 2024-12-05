// @ts-check

import { applyFixes, getVersion } from "markdownlint";
import { lint as lintAsync } from "markdownlint/async";
import { lint as lintPromise } from "markdownlint/promise";
import { lint as lintSync } from "markdownlint/sync";

// Displays the library version
console.log(getVersion());

const options = {
  "files": [ "good.md", "bad.md" ],
  "strings": {
    "good.string": "# good.string\n\nThis string passes all rules.\n",
    "bad.string": "#bad.string\n\n#This string fails\tsome rules.\n"
  }
};

if (true) {

  // Makes a synchronous call, uses result.toString for pretty formatting
  const results = lintSync(options);
  console.log(results.toString());

}

if (true) {

  // Makes an asynchronous call, uses result.toString for pretty formatting
  lintAsync(options, function callback(error, results) {
    if (!error && results) {
      console.log(results.toString());
    }
  });

}

if (true) {

  // Makes a Promise-based asynchronous call, displays the result object directly
  const results = await lintPromise(options);
  console.dir(results, { "colors": true, "depth": null });

}

if (true) {

  // Fixes all supported violations in Markdown content
  const original = "# Heading";
  const results = lintSync({ "strings": { "content": original } });
  const fixed = applyFixes(original, results.content);
  console.log(fixed);

}

// @ts-check

import { load as yamlLoad } from "js-yaml";

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "front-matter-yaml" ],
  "description": "Rule that verifies front matter is YAML",
  "tags": [ "test", "front matter", "yaml" ],
  "parser": "none",
  "function": (params, onError) => {
    const { frontMatterLines } = params;
    if (frontMatterLines.length > 0) {
      const frontMatter = frontMatterLines.slice(1, -1).join("\n").
        replace(/^\n*---\s*\n/u, "").
        replace(/---\s*\n*$/u, "");
      if (frontMatter.length > 0) {
        try {
          yamlLoad(frontMatter);
        } catch (err) {
          console.dir(frontMatterLines)
          console.dir(err)
          onError({
            "frontMatter": true,
            "lineNumber": 1
          });
        }
      }
    }
  }
};

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
      const frontMatterTemp = frontMatterLines.join("\n").replace(/---\s*$/u, "");
      const frontMatterContent = frontMatterTemp.replace(/^\n*---\s*\n/u, "");
      if (frontMatterContent.length > 0) {
        try {
          yamlLoad(frontMatterContent);
        } catch(error) {
          /** @type {import("js-yaml").YAMLException} */
          // @ts-ignore
          const yamlException = error;
          const lineOffset = frontMatterTemp.split("\n").length - frontMatterContent.split("\n").length;
          const { line, column } = yamlException?.mark || { "line": 0, "column": 0 };
          onError({
            "frontMatter": true,
            "lineNumber": line + 1 + lineOffset,
            "range": [ column + 1, 1 ],
            "detail": yamlException.reason
          });
        }
      }
    }
  }
};

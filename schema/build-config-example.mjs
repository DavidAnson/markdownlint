// @ts-check

import fs from "node:fs/promises";
import path from "node:path";
import { dump as yamlDump } from "js-yaml";
import configSchema from "../schema/markdownlint-config-schema.json" with { "type": "json" };

/** @type {import("markdownlint").Configuration} */
const configExample = {};
for (const rule in configSchema.properties) {
  if (/^(?:MD\d{3}|default|extends)$/.test(rule)) {
    // @ts-ignore
    const properties = configSchema.properties[rule];
    configExample[rule + "-description"] = properties.description;
    configExample[rule] = properties.default;
    const subproperties = Object.fromEntries(
      Object.entries(
        properties.oneOf?.at(-1).properties || []
      ).filter(([ key ]) => ((key !== "enabled") && (key !== "severity")))
    );
    if (Object.keys(subproperties).length > 0) {
      /** @type {import("markdownlint").Configuration} */
      const ruleExample = {};
      // eslint-disable-next-line guard-for-in
      for (const property in subproperties) {
        const ruleProperties = subproperties[property];
        ruleExample[property + "-sub-description"] = ruleProperties.description;
        ruleExample[property] = ruleProperties.default;
      }
      configExample[rule] = ruleExample;
    }
  }
}

/**
 * Transforms comments to use the specified prefix.
 *
 * @param {string} input Markdown input.
 * @param {string} commentPrefix Comment prefix.
 * @returns {string} Transformed input.
 */
const transformComments = (input, commentPrefix) => (
  commentPrefix +
  " Example markdownlint configuration with all properties set to their default value\n" +
  input
    .replace(/^(\s*)[^-\s]+-sub-description"?: ['"]?([^'"\n]+)['"]?,?$/gm, "$1" + commentPrefix + " $2")
    .replace(/^(\s*)[^-\s]+-description"?: ['"]?([^'"\n]+)['"]?,?$/gm, "\n$1" + commentPrefix + " $2")
);

const configStringJson = JSON.stringify(configExample, null, 2);
await fs.writeFile(
  path.join(import.meta.dirname, ".markdownlint.jsonc"),
  transformComments(configStringJson, "//"),
  "utf8"
);

const configStringYaml = yamlDump(
  configExample,
  {
    "lineWidth": -1
  }
);
await fs.writeFile(
  path.join(import.meta.dirname, ".markdownlint.yaml"),
  transformComments(configStringYaml, "#"),
  "utf8"
);

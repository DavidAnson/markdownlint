// @ts-check

import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import { __dirname, importWithTypeJson } from "../test/esm-helpers.mjs";
const configSchema = await importWithTypeJson(import.meta, "../schema/markdownlint-config-schema.json");

const configExample = {};
for (const rule in configSchema.properties) {
  if (/^(?:MD\d{3}|default|extends)$/.test(rule)) {
    const properties = configSchema.properties[rule];
    configExample[rule + "-description"] = properties.description;
    configExample[rule] = properties.default;
    if (properties.properties) {
      const ruleExample = {};
      // eslint-disable-next-line guard-for-in
      for (const property in properties.properties) {
        const ruleProperties = properties.properties[property];
        ruleExample[property + "-sub-description"] = ruleProperties.description;
        ruleExample[property] = ruleProperties.default;
      }
      configExample[rule] = ruleExample;
    }
  }
}

const transformComments = (input, commentPrefix) => (
  commentPrefix +
  " Example markdownlint configuration with all properties set to their default value\n" +
  input
    .replace(/^(\s*)[^-\s]+-sub-description"?: "?([^"\n]+)"?,?$/gm, "$1" + commentPrefix + " $2")
    .replace(/^(\s*)[^-\s]+-description"?: "?([^"\n]+)"?,?$/gm, "\n$1" + commentPrefix + " $2")
);

const configStringJson = JSON.stringify(configExample, null, 2);
await fs.writeFile(
  path.join(__dirname(import.meta), ".markdownlint.jsonc"),
  transformComments(configStringJson, "//"),
  "utf8"
);

const configStringYaml = yaml.dump(
  configExample,
  {
    "forceQuotes": true,
    "lineWidth": -1,
    "quotingType": "\""
  }
);
await fs.writeFile(
  path.join(__dirname(import.meta), ".markdownlint.yaml"),
  transformComments(configStringYaml, "#"),
  "utf8"
);

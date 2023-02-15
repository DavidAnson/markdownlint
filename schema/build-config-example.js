// @ts-check

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const configSchema = require("./markdownlint-config-schema.json");
const YAML = require("yaml");

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

const configStringJson = JSON.stringify(configExample, null, 2)
  // eslint-disable-next-line max-len
  .replace(/^\{/, "{\n  // Example markdownlint JSON(C) configuration with all properties set to their default value")
  .replace(/(\s+)"[^-"]+-description": "(.+)",/g, "\n$1// $2")
  .replace(/"[^-"]+-sub-description": "(.+)",/g, "// $1");
fs.writeFileSync(
  path.join(__dirname, ".markdownlint.jsonc"),
  configStringJson,
  "utf8"
);

const configStringYaml = YAML.stringify(configExample, {
  "lineWidth": 0,
  "defaultStringType": "QUOTE_DOUBLE",
  "defaultKeyType": "PLAIN"
})
  .replace(/^(\s*)[^-\s]+-sub-description: "(.+)"$/gm, "$1# $2")
  .replace(/^[^-\s]+-description: "(.+)"$/gm, "\n# $1");
fs.writeFileSync(
  path.join(__dirname, ".markdownlint.yaml"),
  // eslint-disable-next-line max-len
  "# Example markdownlint YAML configuration with all properties set to their default value\n" +
  configStringYaml,
  "utf8"
);

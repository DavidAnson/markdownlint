// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const configSchema = require("./markdownlint-config-schema.json");

const configExample = {};
for (const rule in configSchema.properties) {
  if (/^(MD\d{3}|default|extends)$/.test(rule)) {
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

const configStringYaml = configStringJson
  .replace(/JSON\(C\)/, "YAML")
  .replace(/\n {2}/g, "\n")
  .replace(/\/\/ /g, "# ")
  .replace(/(\s*)"([^"]+)":/g, "$1$2:")
  .replace(/: \{/g, ":")
  .replace(/\n\}/g, "")
  .replace(/,\n/g, "\n")
  .replace(/^\{\n/, "")
  .replace(/\}$/, "");
fs.writeFileSync(
  path.join(__dirname, ".markdownlint.yaml"),
  configStringYaml,
  "utf8"
);

// @ts-check

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const yaml = require("yaml");
const configSchema = require("./markdownlint-config-schema.json");

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
  // eslint-disable-next-line max-len
  " Example markdownlint configuration with all properties set to their default value\n" +
  input
    // eslint-disable-next-line max-len
    .replace(/^(\s*)[^-\s]+-sub-description"?: "?([^"\n]+)"?,?$/gm, "$1" + commentPrefix + " $2")
    // eslint-disable-next-line max-len
    .replace(/^(\s*)[^-\s]+-description"?: "?([^"\n]+)"?,?$/gm, "\n$1" + commentPrefix + " $2")
);

const configStringJson = JSON.stringify(configExample, null, 2);
fs.writeFileSync(
  path.join(__dirname, ".markdownlint.jsonc"),
  transformComments(configStringJson, "//"),
  "utf8"
);

const configStringYaml = yaml.stringify(
  configExample,
  {
    "lineWidth": 0,
    "defaultStringType": "QUOTE_DOUBLE",
    "defaultKeyType": "PLAIN"
  }
);
fs.writeFileSync(
  path.join(__dirname, ".markdownlint.yaml"),
  transformComments(configStringYaml, "#"),
  "utf8"
);

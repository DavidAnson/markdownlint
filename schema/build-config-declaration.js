// @ts-check
/* eslint-disable jsdoc/require-param-description */
/* eslint-disable jsdoc/require-returns-description */

"use strict";

const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");
const {
  FetchingJSONSchemaStore,
  InputData,
  JSONSchemaInput,
  quicktype
} = require("quicktype-core");
const { deprecatedRuleNames, homepage } = require("../lib/constants");

const SCHEMA_PATH = resolve(__dirname, "./markdownlint-config-schema.json");
const OUTPUT_PATH = resolve(__dirname, "./markdownlint-config.d.ts");

/**
 * Returns whether the given identifier is for a rule.
 *
 * @param {string} ruleName
 * @returns {boolean}
 */
function isRuleDefinition(ruleName) {
  return ruleName.startsWith("MD");
}

/**
 * Returns whether the given object describes a rule group.
 *
 * @param {Object} obj
 * @param {string} obj.description
 * @returns {boolean}
 */
function isGroupDefinition({ description }) {
  return description?.includes(" - MD");
}

/**
 * Returns the URL, which can be opened in the browser
 * to see the rule's documentation.
 *
 * @param {string} name
 * @returns {string}
 */
function getDocsUrlForRule(name) {
  const lowercasedName = name.toLowerCase();
  const documentationUrl = `${homepage}/blob/main/doc/${lowercasedName}.md`;
  return `[${name}](${documentationUrl})`;
}

/**
 * @typedef {{
 * ruleJSDoc: string;
 * aliases: Array<{aliasName: string;jsdoc: string;}>;
 * }} RuleJSDocResult
 */

/**
 * Generate JSDoc for a given rule.
 *
 * @param {string} name
 * @param {string} description
 * @returns {RuleJSDocResult}
 */
function generateRuleJSDoc(name, description) {
  const [ names, title ] = description.split(" - ");
  const [ , ...aliases ] = names.split("/");
  const aliasesAsText = aliases.map((alias) => `\`${alias}\``).join(", ");

  const url = getDocsUrlForRule(name);
  const isDeprecated = deprecatedRuleNames.includes(name);
  const deprecationNotice = isDeprecated ? "\n@deprecated" : "";

  // eslint-disable-next-line max-len
  const ruleJSDoc = `${title}.\n\nAliases: ${aliasesAsText}\n\n@see ${url}${deprecationNotice}`;
  const aliasesWithJSDoc = aliases.map((alias) => ({
    "aliasName": alias,
    "jsdoc": `${title}\n\n@see ${url}${deprecationNotice}`
  }));

  return {
    ruleJSDoc,
    "aliases": aliasesWithJSDoc
  };
}

/**
 * Generate JSDoc for a given rule group.
 *
 * @param {string} name
 * @param {string} description
 * @returns {string}
 */
function generateGroupJSDoc(name, description) {
  const [ , rulesComaSeparated ] = description.split(" - ");
  const rules = rulesComaSeparated.split(", ");
  const ruleLinks = rules.map((ruleName) => getDocsUrlForRule(ruleName));
  const rulesLinksComaSeparated = ruleLinks.join(", ");
  return `${name} - ${rulesLinksComaSeparated}`;
}

/**
 * Adds JSDoc to every rule, rule alias or rule group in the given JSON schema.
 *
 * @param {Object} schema
 * @param {Object} schema.properties
 */
function generateJSDocDescriptions({ properties }) {

  /** @type {Record<string, string>} */
  const descriptionPerAliases = {};
  const isAlias = (name) => Object.keys(descriptionPerAliases).includes(name);

  for (const [ name, property ] of Object.entries(properties)) {
    if (isRuleDefinition(name)) {
      const { ruleJSDoc, aliases } = generateRuleJSDoc(
        name,
        property.description
      );

      for (const { aliasName, jsdoc } of aliases) {
        descriptionPerAliases[aliasName] = jsdoc;
      }

      property.description = ruleJSDoc;
    } else if (isGroupDefinition(property)) {
      property.description = generateGroupJSDoc(name, property.description);
    }
  }

  for (const [ name, property ] of Object.entries(properties)) {
    if (isAlias(name)) {
      property.description = descriptionPerAliases[name];
    }
  }
}


/**
 * Generates the TypeScript declarations from the given JSONSchema
 * as text.
 *
 * @param {string} jsonSchemaString
 * @returns {Promise<string>}
 */
async function quicktypeJSONSchema(jsonSchemaString) {
  const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
  await schemaInput.addSource({ "name": "Config",
    "schema": jsonSchemaString });

  const inputData = new InputData();
  inputData.addInput(schemaInput);

  const { lines } = await quicktype({
    inputData,
    "lang": "ts",
    "indentation": "  ",
    "rendererOptions": {
      "just-types": true,
      "prefer-unions": true
    }
  });
  return lines.join("\n");
}

/**
 * Reads the JSONSchema from the `schema` folder
 * and creates a TypeScript declaration file from it.
 *
 * @returns {Promise<void>}
 */
async function generateTypeDeclarations() {
  const schemaText = readFileSync(SCHEMA_PATH, { "encoding": "utf8" });
  const schema = JSON.parse(schemaText);

  // The `$schema` is only needed for `.json` config files.
  delete schema.properties.$schema;

  // Without this change, the ts interface would be invalid
  schema.additionalProperties = true;

  generateJSDocDescriptions(schema);
  const dtsText = await quicktypeJSONSchema(JSON.stringify(schema));
  const dtsTextWithEslintIgnoreComment = `/* eslint-disable */\n${dtsText}`;
  writeFileSync(OUTPUT_PATH, dtsTextWithEslintIgnoreComment);
}

generateTypeDeclarations();

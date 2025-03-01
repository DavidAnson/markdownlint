// @ts-check

/**
 * Result of a call to parseConfiguration.
 *
 * @typedef {Object} ParseConfigurationResult
 * @property {Object | null} config Configuration object if successful.
 * @property {string} message Error message if an error occurred.
 */

/**
 * Parse the content of a configuration file.
 *
 * @param {string} name Name of the configuration file.
 * @param {string} content Configuration content.
 * @param {import("./markdownlint.mjs").ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {ParseConfigurationResult} Parse configuration result.
 */
export default function parseConfiguration(name, content, parsers) {
  let config = null;
  let message = "";
  const errors = [];
  let index = 0;
  // Try each parser
  (parsers || [ JSON.parse ]).every((parser) => {
    try {
      config = parser(content);
    } catch (error) {
      errors.push(`Parser ${index++}: ${error.message}`);
    }
    return !config;
  });
  // Message if unable to parse
  if (!config) {
    errors.unshift(`Unable to parse '${name}'`);
    message = errors.join("; ");
  }
  return {
    config,
    message
  };
}

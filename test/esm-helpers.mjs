// @ts-check

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* eslint-disable jsdoc/no-undefined-types */

/**
 * Gets the file name of the current module.
 * Shims import.meta.filename for Node 18.
 *
 * @param {ImportMeta} meta ESM import.meta object.
 * @returns {string} File name.
 */
// eslint-disable-next-line no-underscore-dangle
export const __filename = (meta) => fileURLToPath(meta.url);

/**
 * Gets the directory name of the current module.
 * Shims import.meta.dirname for Node 18.
 *
 * @param {ImportMeta} meta ESM import.meta object.
 * @returns {string} Directory name.
 */
// eslint-disable-next-line no-underscore-dangle
export const __dirname = (meta) => path.dirname(__filename(meta));

/* eslint-disable jsdoc/reject-any-type */

/**
 * Imports a file as JSON.
 * Avoids "ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time".
 *
 * @param {ImportMeta} meta ESM import.meta object.
 * @param {string} file JSON file to import.
 * @returns {Promise<any>} JSON object.
 */
export const importWithTypeJson = async(meta, file) => (
  // @ts-ignore
  JSON.parse(await fs.readFile(path.resolve(__dirname(meta), file)))
);

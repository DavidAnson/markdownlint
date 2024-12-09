// @ts-check

import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { __dirname, importWithTypeJson } from "../test/esm-helpers.mjs";
const libraryPackageJson = await importWithTypeJson(import.meta, "../package.json");

// eslint-disable-next-line jsdoc/require-jsdoc
function config(options) {
  const { entry, filename, mode, optimization, packageJson } = options;
  const { name, version, homepage, license } = packageJson;
  return {
    "devtool": false,
    "entry": entry,
    "externals": {
      "markdown-it": "markdownit"
    },
    "mode": mode,
    "name": name,
    "optimization": optimization,
    "output": {
      "filename": filename,
      "library": {
        "name": name.replace(/(-\w)/g, (m) => m.slice(1).toUpperCase()),
        "type": "var"
      },
      "path": __dirname(import.meta)
    },
    "plugins": [
      new webpack.BannerPlugin({
        "banner": `${name} ${version} ${homepage} @license ${license}`
      })
    ],
    "ignoreWarnings": [
      {
        "message": /(asset|entrypoint) size limit/
      },
      {
        "message": /dependencies cannot be statically extracted/
      },
      {
        "message": /lazy load some parts of your application/
      }
    ]
  };
}

const modeDevelopment = {
  "mode": "development"
};
const modeProduction = {
  "mode": "production",
  "optimization": {
    "minimizer": [
      new TerserPlugin({
        "extractComments": false,
        "terserOptions": {
          "compress": {
            "passes": 2
          }
        }
      })
    ]
  }
};
const entryLibrary = {
  "entry": "./browser-exports.mjs",
  "packageJson": libraryPackageJson
};
export default [
  config({
    ...entryLibrary,
    ...modeDevelopment,
    "filename": "markdownlint-browser.js"
  }),
  config({
    ...entryLibrary,
    ...modeProduction,
    "filename": "markdownlint-browser.min.js"
  })
];

// @ts-check

"use strict";

const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const nodeModulePrefixRe = /^node:/u;

function config(options) {
  const { entry, filename, mode, optimization, packageJson } = options;
  const { name, version, homepage, license } = packageJson;
  return {
    "devtool": false,
    "entry": entry,
    "externals": {
      "markdown-it": "markdownit",
      "markdownlint-micromark": "micromarkBrowser"
    },
    "mode": mode,
    "module": {
      "rules": [
        {
          "test": /\.[cm]?js$/,
          "exclude": /node_modules/,
          "use": {
            "loader": "babel-loader",
            "options": {
              "presets": [
                [
                  "@babel/preset-env",
                  {
                    "targets": "defaults"
                  }
                ]
              ]
            }
          }
        }
      ]
    },
    "name": name,
    "optimization": optimization,
    "output": {
      "filename": filename,
      "library": {
        "name": name.replace(/(-\w)/g, (m) => m.slice(1).toUpperCase()),
        "type": "var"
      },
      "path": __dirname
    },
    "plugins": [
      new webpack.NormalModuleReplacementPlugin(
        nodeModulePrefixRe,
        (resource) => {
          const module = resource.request.replace(nodeModulePrefixRe, "");
          resource.request = module;
        }
      ),
      new webpack.BannerPlugin({
        "banner": `${name} ${version} ${homepage} @license ${license}`
      })
    ],
    "resolve": {
      "fallback": {
        "fs": false,
        "os": false,
        "path": false,
        "util": false
      }
    }
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
  "entry": "./markdownlint-exports.js",
  "packageJson": require("../package.json")
};
// const entryHelpers = {
//   "entry": "../helpers/helpers.js",
//   "packageJson": require("../helpers/package.json")
// };
module.exports = [
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
  // config({
  //   ...entryHelpers,
  //   ...modeDevelopment,
  //   "filename": "markdownlint-rule-helpers-browser.js"
  // }),
  // config({
  //   ...entryHelpers,
  //   ...modeProduction,
  //   "filename": "markdownlint-rule-helpers-browser.min.js"
  // })
];

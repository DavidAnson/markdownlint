// @ts-check

"use strict";

const path = require("path");
const webpack = require("webpack");

function config(options) {
  const { entry, filename, mode, packageJson } = options;
  const { name, version, homepage, license } = packageJson;
  return {
    "devtool": false,
    "entry": entry,
    "externals": {
      "markdown-it": "markdownit"
    },
    "mode": mode,
    "module": {
      "rules": [
        {
          "test": /.js$/,
          "use": [
            {
              "loader": "ts-loader",
              "options": {
                "configFile": path.resolve(__dirname, "tsconfig.json")
              }
            }
          ]
        }
      ]
    },
    "name": name,
    "output": {
      "filename": filename,
      "library": name.replace(/(-\w)/g, (m) => m.slice(1).toUpperCase()),
      "path": __dirname
    },
    "plugins": [
      new webpack.BannerPlugin({
        "banner": `${name} ${version} ${homepage} @license ${license}`
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_DEBUG": false
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

module.exports = [
  config({
    "entry": "../lib/markdownlint.js",
    "filename": "markdownlint-browser.js",
    "mode": "development",
    "packageJson": require("../package.json")
  }),
  config({
    "entry": "../lib/markdownlint.js",
    "filename": "markdownlint-browser.min.js",
    "mode": "production",
    "packageJson": require("../package.json")
  }),
  config({
    "entry": "../helpers/helpers.js",
    "filename": "markdownlint-rule-helpers-browser.js",
    "mode": "development",
    "packageJson": require("../helpers/package.json")
  }),
  config({
    "entry": "../helpers/helpers.js",
    "filename": "markdownlint-rule-helpers-browser.min.js",
    "mode": "production",
    "packageJson": require("../helpers/package.json")
  })
];

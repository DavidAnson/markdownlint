// @ts-check

"use strict";

const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { name, version, homepage } = require("./package.json");

const htmlEntry = "./exports-html.mjs";
const htmlName = "micromarkHtmlBrowser";

const base = {
  "entry": "./exports.mjs",
  "output": {
    "path": __dirname
  },
  "plugins": [
    new webpack.BannerPlugin({
      "banner": `${name} ${version} ${homepage}`
    })
  ]
};

const commonjs = {
  ...base,
  "output": {
    ...base.output,
    "library": {
      "type": "commonjs"
    }
  },
  "target": "node"
};

const web = {
  ...base,
  "output": {
    ...base.output,
    "library": {
      "name": "micromarkBrowser",
      "type": "var"
    }
  },
  "target": "web"
};

const production = {
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

const development = {
  "devtool": false,
  "mode": "development"
};

module.exports = [
  {
    ...commonjs,
    ...production,
    "output": {
      ...commonjs.output,
      "filename": "micromark.cjs"
    }
  },
  {
    ...commonjs,
    ...development,
    "output": {
      ...commonjs.output,
      "filename": "micromark.dev.cjs"
    }
  },
  {
    ...web,
    ...production,
    "output": {
      ...web.output,
      "filename": "micromark-browser.js"
    }
  },
  {
    ...web,
    ...development,
    "output": {
      ...web.output,
      "filename": "micromark-browser.dev.js"
    }
  },
  {
    ...web,
    ...production,
    "entry": htmlEntry,
    "output": {
      ...web.output,
      "library": {
        ...web.output.library,
        "name": htmlName
      },
      "filename": "micromark-html-browser.js"
    }
  },
  {
    ...web,
    ...development,
    "entry": htmlEntry,
    "output": {
      ...web.output,
      "library": {
        ...web.output.library,
        "name": htmlName
      },
      "filename": "micromark-html-browser.dev.js"
    }
  }
];

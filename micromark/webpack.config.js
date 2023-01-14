// @ts-check

"use strict";

const shared = {
  "entry": "./exports.mjs",
  "output": {
    "library": {
      "type": "commonjs"
    },
    "path": __dirname
  },
  "target": "node"
};

module.exports = [
  {
    ...shared,
    "mode": "production",
    "output": {
      ...shared.output,
      "filename": "micromark.js"
    }
  },
  {
    ...shared,
    "devtool": false,
    "mode": "development",
    "output": {
      ...shared.output,
      "filename": "micromark.dev.js"
    }
  }
];

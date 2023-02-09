// @ts-check

"use strict";

const base = {
  "entry": "./exports.mjs",
  "output": {
    "path": __dirname
  }
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
  "mode": "production"
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
  }
];

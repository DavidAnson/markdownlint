// @ts-check

"use strict";

const { pathToFileURL } = require("url");
const fs = require("fs");

const { filterTokens, addError } = require("../helpers");

module.exports = {
  "names": [ "MD051", "no-dead-relative-links" ],
  "description": "No dead relative links",
  "tags": [ "links" ],
  "function": function MD051(params, onError) {
    filterTokens(params, "inline", (token) => {
      token.children.forEach((child) => {
        const { lineNumber, type, attrs } = child;
        if (type === "link_open") {
          attrs.forEach((attr) => {
            if (attr[0] === "href") {
              const href = attr[1];
              const url = new URL(href, pathToFileURL(params.name));
              url.hash = "";
              const isRelative = href.startsWith("./") ||
                href.startsWith("../");
              if (isRelative && !fs.existsSync(url.pathname)) {
                const detail = `Link "${href}" is dead (path: ${url.pathname})`;
                addError(onError, lineNumber, detail);
              }
            }
          });
        }
      });
    });
  }
};

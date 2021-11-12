// @ts-check

"use strict";

const fs = require("fs");
const globby = require("globby");

const [ command, ...args ] = process.argv.slice(2);

if (command === "copy") {
  const [ src, dest ] = args;
  fs.copyFileSync(src, dest);
} else if (command === "delete") {
  for (const arg of args) {
    for (const file of globby.sync(arg)) {
      fs.unlinkSync(file);
    }
  }
} else {
  throw new Error(`Unsupported command: ${command}`);
}

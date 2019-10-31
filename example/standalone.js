// @ts-check

"use strict";

const markdownlint = require("../lib/markdownlint");

const options = {
  "files": [ "good.md", "bad.md" ],
  "strings": {
    "good.string": "# good.string\n\nThis string passes all rules.\n",
    "bad.string": "#bad.string\n\n#This string fails\tsome rules.\n"
  }
};

// Makes a synchronous call, using result.toString for pretty formatting
const result = markdownlint.sync(options);
console.log(result.toString());

// Makes an asynchronous call
markdownlint(options, function callback(err, result) {
  if (!err) {
    console.log(result.toString());
  }
});

// Displays the result object directly
markdownlint(options, function callback(err, result) {
  if (!err) {
    console.dir(result, { "colors": true, "depth": null });
  }
});

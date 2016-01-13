"use strict";

var markdownlint = require("../lib/markdownlint");

var options = {
  "files": [ "good.md", "bad.md" ],
  "strings": {
    "good.string": "# good.string\n\nThis string passes all rules.",
    "bad.string": "#bad.string\n\n#This string fails\tsome rules."
  }
};

// Uses result.toString for pretty formatting
markdownlint(options, function callback(err, result) {
  if (!err) {
    console.log(result.toString());
  }
});

// Examines the result object directly
markdownlint(options, function callback(err, result) {
  if (!err) {
    console.dir(result, { "colors": true });
  }
});

// Make a synchronous call, passing true to toString()
var result = markdownlint.sync(options);
console.log(result.toString(true));

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
    console.dir(result, { "colors": true, "depth": null });
  }
});

// Again, using resultVersion 1 for more detail
options.resultVersion = 1;
markdownlint(options, function callback(err, result) {
  if (!err) {
    console.dir(result, { "colors": true, "depth": null });
  }
});

// Make a synchronous call, passing true to toString()
var result = markdownlint.sync(options);
console.log(result.toString(true));

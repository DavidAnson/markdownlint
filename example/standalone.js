"use strict";

var markdownlint = require("../lib/markdownlint");

var options = {
  "files": [ "good.md", "bad.md" ]
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

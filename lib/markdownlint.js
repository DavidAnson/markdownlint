"use strict";

var fs = require("fs");
var rules = require("./rules");

function lintFile(file, options) {
  var results = {};
  var contents = fs.readFileSync(file, { encoding: "utf8" });
  var lines = contents.split(/\r\n|\n/g);
  Object.keys(rules).forEach(function(name) {
    var rule = rules[name];
    var errors = rule(lines);
    if (errors.length) {
      results[name] = errors;
    }
  });
  return results;
}

module.exports = function(options) {
  var results = {};
  var files = options.files || [];
  files.forEach(function(file) {
    results[file] = lintFile(file, options);
  });
  return results;
};

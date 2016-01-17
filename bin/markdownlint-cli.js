#!/usr/bin/env node

"use strict";

/* eslint no-console:0, no-process-exit:0 */

var pkg = require("../package");
var program = require("commander");

function readConfiguration(args) {
  var rc = require("rc");
  var config = rc(pkg.name, {});
  if (args.config) {
    var fs = require("fs");
    try {
      var userConfig = JSON.parse(fs.readFileSync(args.config));
      var extend = require("deep-extend");
      config = extend(config, userConfig);
    } catch (e) {
      console.warn("Cannot read or parse config file", args.config);
    }
  }
  return config;
}

function lint(lintFiles, config) {
  var markdownlint = require("../" + pkg.main);
  var lintOptions = {
    "files": lintFiles,
    "config": config
  };
  return markdownlint.sync(lintOptions);
}

function printResult(lintResult) {
  // var chalk = require("chalk");
  console.log(lintResult.toString());
}

function isResultCorrect(lintResult) {
  var _ = require("lodash");
  function notEmptyObject(item) {
    return !_.isEqual(item, {});
  }
  return _.values(lintResult).some(notEmptyObject);
}

program
  .version(pkg.version)
  .description(pkg.description)
  .usage("[options] <files>")
  .option("-c, --config [configFile]", "Configuration file");

program.parse(process.argv);

var files = program.args;

if (files && files.length > 0) {
  var config = readConfiguration(program);
  var lintResult = lint(files, config);
  printResult(lintResult);
  if (isResultCorrect(lintResult)) {
    process.exit(1);
  }
} else {
  program.help();
}

// @ts-check

"use strict";

module.exports = function wrapper(grunt) {
  grunt.initConfig({
    "markdownlint": {
      "example": {
        "src": [ "*.md" ]
      }
    }
  });

  grunt.registerMultiTask("markdownlint", function task() {
    const done = this.async();
    import("markdownlint").then(({ "default": markdownlint }) => {
      markdownlint(
        { "files": this.filesSrc },
        function callback(err, result) {
          const resultString = err || ((result || "").toString());
          if (resultString) {
            grunt.fail.warn("\n" + resultString + "\n");
          }
          done(!err || !resultString);
        });
    }).catch(done);
  });
};

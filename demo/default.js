"use strict";

(function main() {
  // DOM elements
  var markdown = document.getElementById("markdown");
  var markup = document.getElementById("markup");
  var numbered = document.getElementById("numbered");
  var violations = document.getElementById("violations");
  var form = document.getElementsByTagName("form")[0];
  var openFile = document.getElementById("openFile");

  // Variables
  var markdownit = window.markdownit({ "html": true });
  var newLineRe = /\r\n|\r|\n/;
  var rulesMd = "https://github.com/DavidAnson/markdownlint" +
    "/blob/master/doc/Rules.md";

  // Sanitize string for HTML display
  function sanitize(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Handle input
  function onMarkdownInput() {
    // Markdown
    var content = markdown.value;
    // Markup
    markup.innerHTML = markdownit.render(content);
    // Numbered
    var lines = content.split(newLineRe);
    var padding = lines.length.toString().replace(/\d/g, " ");
    numbered.innerHTML = lines
      .map(function mapNumberedLine(line, index) {
        line = sanitize(line);
        index++;
        var paddedIndex = (padding + index).slice(-padding.length);
        return "<span id='l" + index + "'><em>" + paddedIndex + "</em>: " +
          line + "</span>";
      }).join("\n");
    // Violations
    var options = {
      "strings": {
        "content": content
      },
      "config": {
        "MD013": false
      }
    };
    var results = window.markdownlint.sync(options);
    violations.innerHTML = results.content.map(function mapResult(result) {
      var ruleRef = rulesMd + "#" + result.ruleName.toLowerCase() + "---" +
        result.ruleDescription.toLowerCase().replace(/ /g, "-");
      return "<a href='#" + result.lineNumber + "'><em>" + result.lineNumber +
        "</em></a> - <a href='" + ruleRef + "'>" + result.ruleName + "</a> " +
        result.ruleDescription +
        (result.errorDetail ?
          " [<span class='detail'>" +
            sanitize(result.errorDetail) +
            "</span>]" :
          "") +
        (result.errorContext ?
          " [<span class='detail'>Context: \"" +
            sanitize(result.errorContext) +
            "\"</span>]" :
          "");
      /* + (result.errorRange ?
        " <u style='white-space: pre-wrap'>" +
          lines[result.lineNumber - 1].substr(
            result.errorRange[0] - 1, result.errorRange[1]) +
          "</u>" :
        ""); */
    }).join("<br/>");
  }

  // Load from a string or File object
  function loadMarkdown(source) {
    // Reset input element
    form.reset();
    if (typeof source === "string") {
      // Update from string
      markdown.value = source;
      onMarkdownInput();
    } else {
      // Update from File object
      var reader = new FileReader();
      reader.onload = function readerOnload(e) {
        markdown.value = e.target.result;
        onMarkdownInput();
      };
      reader.readAsText(source);
    }
  }

  // Handle drag-and-drop
  function onDragOver(e) {
    if (e.dataTransfer && e.dataTransfer.dropEffect) {
      e.dataTransfer.dropEffect = "link";
      e.preventDefault();
    }
  }
  function onDrop(e) {
    if (e.dataTransfer && e.dataTransfer.files) {
      loadMarkdown(e.dataTransfer.files[0]);
      e.preventDefault();
    }
  }

  // Handle file open
  function onOpenFileChange(e) {
    if (e.target && e.target.files) {
      loadMarkdown(e.target.files[0]);
    }
  }

  // Handle violation navigation
  function onLineNumberClick(e) {
    var line = document.getElementById("l" + e.target.textContent);
    if (line) {
      var highlighted = document.getElementsByClassName("highlight");
      Array.prototype.forEach.call(highlighted, function forElement(element) {
        element.classList.remove("highlight");
      });
      line.classList.add("highlight");
      line.scrollIntoView();
      e.preventDefault();
    }
  }

  // Add event listeners
  document.body.addEventListener("dragover", onDragOver);
  document.body.addEventListener("drop", onDrop);
  openFile.addEventListener("change", onOpenFileChange);
  markdown.addEventListener("input", onMarkdownInput);
  violations.addEventListener("click", onLineNumberClick, true);

  /* eslint-disable max-len */
  markdown.value = [
    "## Introduction",
    "",
    "`markdownlint` is a [Node.js](https://nodejs.org/)/[io.js](https://iojs.org/) style checker and lint tool for [Markdown](http://en.wikipedia.org/wiki/Markdown)/[CommonMark](http://commonmark.org/) files to automatically validate content, prevent rendering problems, and promote consistency.",
    "This page offers an easy way to try it out interactively!",
    "",
    "####  Instructions",
    "",
    "Type or paste `Markdown ` content in the upper-left box, drag-and-drop a file, or open one with the chooser at the top.",
    "Content gets parsed and displayed in the upper-right box; rule violations (if any) show up in the lower-right box.",
    "Click a violation for information about it or click its line number to highlighted it in the lower-left box.",
    "",
    "> *Note*: [All rules](https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md) are enabled except for [MD013 Line length](https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md#md013---line-length). ",
    "",
    "",
    "#### Resources",
    "* [`markdownlint` on GitHub](https://github.com/DavidAnson/markdownlint)",
    "* [`markdownlint` on npm](https://www.npmjs.com/package/markdownlint)",
    "* [Markdown specification](http://daringfireball.net/projects/markdown/)",
    "*\t[CommonMark specification](http://commonmark.org/)",
    "",
    "#### Thanks",
    "",
    "[`markdownlint/Ruby`](https://github.com/markdownlint/markdownlint) for the inspiration and [`markdown-it`](https://github.com/markdown-it/markdown-it) for the parser and interactive demo idea!"
  ].join("\n");
  /* eslint-enable max-len */
  onMarkdownInput();
}());

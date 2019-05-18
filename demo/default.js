"use strict";

(function main() {
  // DOM elements
  var markdown = document.getElementById("markdown");
  var markup = document.getElementById("markup");
  var numbered = document.getElementById("numbered");
  var violations = document.getElementById("violations");
  var form = document.getElementsByTagName("form")[0];
  var openFile = document.getElementById("openFile");
  var copyLink = document.getElementById("copyLink");

  // Variables
  var markdownit = window.markdownit({ "html": true });
  var newLineRe = /\r\n|\r|\n/;
  var hashPrefix = "%m";
  var rulesMd = "https://github.com/DavidAnson/markdownlint" +
    "/blob/master/doc/Rules.md";

  // Do-nothing function
  function noop() {}

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
      },
      "handleRuleFailures": true
    };
    var results = window.markdownlint.sync(options);
    violations.innerHTML = results.content.map(function mapResult(result) {
      var ruleName = result.ruleNames[0];
      var ruleRef = rulesMd + "#" + ruleName.toLowerCase() + "---" +
        result.ruleDescription.toLowerCase()
          .replace(/ /g, "-")
          .replace(/[()]/g, "");
      return "<a href='#" + result.lineNumber + "'><em>" + result.lineNumber +
        "</em></a> - <a href='" + ruleRef + "'>" + ruleName + "</a> " +
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
      // + (result.errorRange ?
      //     " <u style='white-space: pre-wrap'>" +
      //       lines[result.lineNumber - 1].substr(
      //         result.errorRange[0] - 1, result.errorRange[1]) +
      //     "</u>" :
      //     "");
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
      reader.onload = function onload(e) {
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

  // Updates the URL hash and copies the URL to the clipboard
  function onCopyLinkClick(e) {
    window.location.hash = encodeURIComponent(hashPrefix + markdown.value);
    /* eslint-disable-next-line no-unused-expressions */
    navigator.clipboard && navigator.clipboard.writeText &&
      navigator.clipboard.writeText(window.location).then(noop, noop);
    e.preventDefault();
  }

  // Add event listeners
  document.body.addEventListener("dragover", onDragOver);
  document.body.addEventListener("drop", onDrop);
  openFile.addEventListener("change", onOpenFileChange);
  markdown.addEventListener("input", onMarkdownInput);
  violations.addEventListener("click", onLineNumberClick, true);
  copyLink.addEventListener("click", onCopyLinkClick);

  /* eslint-disable max-len */
  markdown.value = [
    "## Introduction",
    "",
    "`markdownlint` is a [Node.js](https://nodejs.org/) style checker and lint tool for [Markdown](https://en.wikipedia.org/wiki/Markdown)/[CommonMark](https://commonmark.org/) files to automatically validate content, prevent rendering problems, and promote consistency.",
    "This page offers an easy way to try it out interactively!",
    "",
    "####  Instructions",
    "",
    "Type or paste `Markdown ` content in the upper-left box, drag-and-drop a file, or open one with the chooser at the top.",
    "Content gets parsed and displayed in the upper-right box; rule violations (if any) show up in the lower-right box.",
    "Click a violation for information about it or click its line number to highlighted it in the lower-left box.",
    "",
    "> *Note*: [All rules](https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md) are enabled except [MD013/line-length](https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md#md013) and [MD002/first-heading-h1](https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md#md002) (deprecated). ",
    "",
    "",
    "#### Resources",
    "* [`markdownlint` on GitHub](https://github.com/DavidAnson/markdownlint)",
    "* [`markdownlint` on npm](https://www.npmjs.com/package/markdownlint)",
    "* [Markdown specification](https://daringfireball.net/projects/markdown/)",
    "*\t[CommonMark specification](https://commonmark.org/)",
    "",
    "#### Thanks",
    "",
    "[`markdownlint/Ruby`](https://github.com/markdownlint/markdownlint) for the inspiration and [`markdown-it`](https://github.com/markdown-it/markdown-it) for the parser and interactive demo idea!",
    ""
  ].join("\n");
  /* eslint-enable max-len */

  // Update Markdown from hash (if present)
  if (window.location.hash) {
    try {
      const decodedHash = decodeURIComponent(window.location.hash.substring(1));
      if (hashPrefix === decodedHash.substring(0, hashPrefix.length)) {
        markdown.value = decodedHash.substring(hashPrefix.length);
      }
    } catch (ex) {
      // Invalid
    }
  }

  // Detect legacy browsers
  try {
    /* eslint-disable-next-line no-new */
    new URL(rulesMd);
  } catch (ex) {
    markdown.value = [
      "# Sorry",
      "",
      "This browser is not supported."
    ].join("\n");
  }

  // Initialize
  onMarkdownInput();
}());

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
  var markdownit = window.markdownit();
  var newLineRe = /\r\n|\r|\n/;
  var rulesMd = "https://github.com/DavidAnson/markdownlint" +
    "/blob/master/doc/Rules.md";

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
        index++;
        var paddedIndex = (padding + index).slice(-padding.length);
        return "<span id='l" + index + "'><em>" + paddedIndex + "</em>: " +
          line + "</span>";
      }).join("\n");
    // Violations
    var options = {
      "strings": {
        "content": content
      }
    };
    var results = window.markdownlint.sync(options).toString();
    violations.innerHTML = results.split(newLineRe)
      .map(function mapResultLine(line) {
        return line.replace(/^content: (\d+): (MD\d\d\d) (.*)$/,
          function replacer(match, p1, p2, p3) {
            var ruleRef = rulesMd + "#" + p2.toLowerCase() + "---" +
              p3.toLowerCase().replace(/ /g, "-");
            return "<a href='#" + p1 + "'><em>" + p1 + "</em></a> - " +
              "<a href='" + ruleRef + "' target='_blank'>" + p2 + "</a> " + p3;
          });
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
    var line = document.getElementById("l" + e.target.innerText);
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
}());

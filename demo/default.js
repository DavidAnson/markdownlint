"use strict";

(function main() {
  // Dependencies
  var markdownit = globalThis.markdownit;
  var markdownlint = globalThis.markdownlint;
  var micromark = markdownlint;

  // DOM elements
  var markdown = document.getElementById("markdown");
  var markup = document.getElementById("markup");
  var numbered = document.getElementById("numbered");
  var violations = document.getElementById("violations");
  var form = document.getElementsByTagName("form")[0];
  var openFile = document.getElementById("openFile");
  var copyLink = document.getElementById("copyLink");

  // Variables
  var newLineRe = /\r\n|\r|\n/;
  var hashPrefix = "%m";
  var allLintErrors = [];

  // Do-nothing function
  function noop() {}

  // Sanitize string for HTML display
  function sanitize(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Renders directive metadata
  function handleDirective(directive) {
    const content = directive.content;
    delete directive.content;
    if (content) {
      this.tag("<blockquote>");
    }
    this.tag("<code>");
    this.raw(this.encode(JSON.stringify(directive)));
    this.tag("</code>");
    this.raw(content);
    if (content) {
      this.tag("</blockquote>");
    }
  }

  // Renders Markdown to HTML
  function render(markdown) {
    markdown = markdown.replace(markdownlint.frontMatterRe, "");
    const match = /^\?renderer=([a-z-]+)$/.exec(globalThis.location.search);
    const renderer = match ? match[1] : "micromark";
    if (renderer === "markdown-it") {
      return markdownit({ "html": true }).render(markdown);
    } else if (renderer === "micromark") {
      const parseOptions = {
        "extensions": [
          micromark.directive(),
          micromark.gfmAutolinkLiteral(),
          micromark.gfmFootnote(),
          micromark.gfmTable(),
          micromark.math()
        ]
      };
      const context = micromark.parse(parseOptions);
      const chunks = micromark.preprocess()(markdown, undefined, true);
      const events = micromark.postprocess(context.document().write(chunks));
      const compileOptions = {
        "allowDangerousHtml": true,
        "htmlExtensions": [
          micromark.directiveHtml({ "*": handleDirective }),
          micromark.gfmAutolinkLiteralHtml(),
          micromark.gfmFootnoteHtml(),
          micromark.gfmTableHtml(),
          micromark.mathHtml()
        ]
      };
      try {
        return micromark.compile(compileOptions)(events);
      } catch(error) {
        return `[Exception: "${error}"]`;
      }
    }
    return `[Unsupported renderer "${renderer}"]`;
  }

  // Highlight error ranges
  function highlightErrors(results, className) {
    for (const result of results) {
      const { errorRange, lineNumber } = result;
      const line = document.getElementById(`l${lineNumber}`);
      line.classList.add(className);
      if (errorRange) {
        const [ col, len ] = errorRange;
        for (let i = 0; i < len; i++) {
          var char = document.getElementById(`l${lineNumber}c${col + i}`);
          char.classList.add(className);
        }
      }
    }
  }

  // Handle input
  function onMarkdownInput() {
    // Markdown
    var content = markdown.value;
    // Markup
    markup.innerHTML = render(content);
    // Numbered
    var lines = content.split(newLineRe);
    var padding = lines.length.toString().replace(/\d/g, " ");
    numbered.innerHTML = lines
      .map(function mapNumberedLine(line, index) {
        index++;
        var paddedIndex = (padding + index).slice(-padding.length);
        return (
          `<span><em id='l${index}'>${paddedIndex}</em>: ` +
            // eslint-disable-next-line unicorn/prefer-spread
            line.split("").map((c, i) => `<span id='l${index}c${i + 1}'>${sanitize(c)}</span>`).join("") +
          "</span>"
        );
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
    allLintErrors = markdownlint.lintSync(options).content;
    violations.innerHTML = allLintErrors.map(function mapResult(result) {
      var ruleName = result.ruleNames.slice(0, 2).join(" / ");
      var resultJson = encodeURIComponent(JSON.stringify(result)).replaceAll("'", "%27");
      return "<em><a href='#line' target='" + resultJson + "'>" +
        result.lineNumber + "</a></em> - <a href='" + result.ruleInformation +
        "'>" + ruleName + "</a> " +
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
          "") +
        (result.fixInfo ?
          " [<a href='#fix' target='" +
            resultJson +
            "' class='detail'>Fix</a>]" :
          "");
    }).join("<br/>");
    // Highlight errors
    highlightErrors(allLintErrors, "error");
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
      source.text().then((text) => {
        markdown.value = text;
        onMarkdownInput();
      });
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
  function onViolationClick(e) {
    const resultJson = JSON.parse(decodeURIComponent(e.target.target));
    switch (e.target.hash) {
      case "#fix":
        var errors = e.shiftKey ?
          allLintErrors :
          [ resultJson ];
        var fixed = markdownlint.applyFixes(markdown.value, errors);
        markdown.value = fixed;
        onMarkdownInput();
        e.preventDefault();
        break;
      case "#line":
        // eslint-disable-next-line unicorn/no-useless-spread
        for (const element of [ ...document.getElementsByClassName("highlight") ]) {
          element.classList.remove("highlight");
        }
        highlightErrors([ resultJson ], "highlight");
        var line = document.getElementById(`l${resultJson.lineNumber}`);
        line.scrollIntoView();
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  // Updates the URL hash and copies the URL to the clipboard
  function onCopyLinkClick(e) {
    globalThis.location.hash = encodeURIComponent(hashPrefix + markdown.value);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(globalThis.location).then(noop, noop);
    } else {
      /* eslint-disable-next-line no-alert */
      alert("Document URL updated, select and copy it now.");
    }
    e.preventDefault();
  }

  // Show library version
  var version = markdownlint.getVersion();
  document.getElementById("version").textContent = "(v" + version + ")";

  // Add event listeners
  document.body.addEventListener("dragover", onDragOver);
  document.body.addEventListener("drop", onDrop);
  openFile.addEventListener("change", onOpenFileChange);
  markdown.addEventListener("input", onMarkdownInput);
  violations.addEventListener("click", onViolationClick, true);
  copyLink.addEventListener("click", onCopyLinkClick);

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
    "> *Note*: [All rules](https://github.com/DavidAnson/markdownlint/blob/v" + version + "/doc/Rules.md) are enabled except [MD013/line-length](https://github.com/DavidAnson/markdownlint/blob/v" + version + "/doc/md013.md).",
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

  // Update Markdown from hash (if present)
  if (globalThis.location.hash) {
    try {
      var decodedHash = decodeURIComponent(globalThis.location.hash.substring(1));
      if (hashPrefix === decodedHash.substring(0, hashPrefix.length)) {
        markdown.value = decodedHash.substring(hashPrefix.length);
      }
    } catch {
      // Invalid
    }
  }

  // Detect legacy browsers
  try {
    /* eslint-disable-next-line no-new */
    new URL("https://example.com/");
  } catch {
    markdown.value = [
      "# Sorry",
      "",
      "This browser is not supported."
    ].join("\n");
  }

  // Initialize
  onMarkdownInput();
}());

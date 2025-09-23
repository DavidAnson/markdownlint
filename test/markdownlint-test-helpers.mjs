// @ts-check

import os from "node:os";
import path from "node:path";
import test from "ava";
import { characterEntities } from "character-entities";
import { gemoji } from "gemoji";
import helpers, { formatLintResults } from "../helpers/helpers.cjs";
import { lint } from "markdownlint/promise";
import { forEachInlineCodeSpan } from "../lib/markdownit.cjs";
import { getReferenceLinkImageData } from "../lib/cache.mjs";

test("clearHtmlCommentTextValid", (t) => {
  t.plan(1);
  const validComments = [
    "<!-->",
    "<!--->",
    "<!---->",
    "<!-- comment -->",
    " <!-- comment -->",
    "  <!-- comment -->",
    "<!-- text -->",
    "<!--text-->",
    "<!-- -->",
    "<!-- -- -->",
    "<!---->",
    "<!---text-->",
    "<!--text-text-->",
    "<!--- -->",
    "<!--",
    "-->",
    "<!--",
    "",
    "-->",
    "<!--",
    "",
    "",
    "-->",
    "<!--",
    "",
    " text ",
    "",
    "-->",
    "<!--text",
    "",
    "text-->",
    "text<!--text-->text",
    "text<!--",
    "-->text",
    "text<!--",
    "text",
    "-->text",
    "<!--text--><!--text-->",
    "text<!--text-->text<!--text-->text",
    "text<!--text > text <!-->text",
    "<!--",
    "text"
  ];
  const validResult = [
    "<!-->",
    "<!--->",
    "<!---->",
    "<!-- ....... -->",
    " <!-- ....... -->",
    "  <!-- ....... -->",
    "<!-- .... -->",
    "<!--....-->",
    "<!-- -->",
    "<!-- .. -->",
    "<!---->",
    "<!--.....-->",
    "<!--.........-->",
    "<!--. -->",
    "<!--",
    "-->",
    "<!--",
    "",
    "-->",
    "<!--",
    "",
    "",
    "-->",
    "<!--",
    "",
    " .....",
    "",
    "-->",
    "<!--....",
    "",
    "....-->",
    "text<!--....-->text",
    "text<!--",
    "-->text",
    "text<!--",
    "....",
    "-->text",
    "<!--....--><!--....-->",
    "text<!--....-->text<!--....-->text",
    "text<!--.... . .... ..-->text",
    "<!--",
    "text"
  ];
  const actual = helpers.clearHtmlCommentText(validComments.join("\n"));
  const expected = validResult.join("\n");
  t.is(actual, expected);
});

test("clearHtmlCommentTextInvalid", (t) => {
  t.plan(1);
  const invalidComments = [
    "<!>",
    "<!->",
    "<!-->",
    "<!--->",
    "<!--> -->",
    "<!-->text-->",
    "<!--->text-->",
    "<!---->",
    "<!-->-->",
    "<!-->t-->",
    "<!--->-->",
    "<!--->t-->",
    "<!---->t-->",
    "    <!-- ........ .... ..... -->"
  ];
  const actual = helpers.clearHtmlCommentText(invalidComments.join("\n"));
  const expected = invalidComments.join("\n");
  t.is(actual, expected);
});

test("clearHtmlCommentTextNonGreedy", (t) => {
  t.plan(1);
  const nonGreedyComments = [
    "<!-- text --> -->",
    "<!---text --> -->",
    "<!--t--> -->",
    "<!----> -->"
  ];
  const nonGreedyResult = [
    "<!-- .... --> -->",
    "<!--..... --> -->",
    "<!--.--> -->",
    "<!----> -->"
  ];
  const actual = helpers.clearHtmlCommentText(nonGreedyComments.join("\n"));
  const expected = nonGreedyResult.join("\n");
  t.is(actual, expected);
});

test("clearHtmlCommentTextEmbedded", (t) => {
  t.plan(1);
  const embeddedComments = [
    "text<!--text-->text",
    "<!-- markdownlint-disable MD010 -->",
    "text<!--text-->text",
    "text<!-- markdownlint-disable MD010 -->text",
    "text<!--text-->text"
  ];
  const embeddedResult = [
    "text<!--....-->text",
    "<!-- .................... ..... -->",
    "text<!--....-->text",
    "text<!-- .................... ..... -->text",
    "text<!--....-->text"
  ];
  const actual = helpers.clearHtmlCommentText(embeddedComments.join("\n"));
  const expected = embeddedResult.join("\n");
  t.is(actual, expected);
});

test("isBlankLine", (t) => {
  t.plan(33);
  // @ts-ignore
  t.true(helpers.isBlankLine(null), "[null]");
  const blankLines = [
    "",
    " ",
    "  ",
    "\t\t\t",
    "\r",
    "\n",
    "\t\r\n",
    " <!-- text --> ",
    "<!--text-->",
    "<!---->",
    "<!-- text -->\t<!-- text -->",
    ">",
    "> ",
    "> > > \t",
    "> <!--text-->",
    ">><!--text-->",
    "<!--",
    "  <!-- text",
    "text -->  ",
    "-->",
    "text --> <!--text--> <!--text--> <!-- text",
    "text --> --> <!--text--> <!--text--> <!-- <!-- text"
  ];
  for (const line of blankLines) {
    t.true(helpers.isBlankLine(line), line);
  }
  const nonBlankLines = [
    "text",
    " text ",
    ".",
    "> .",
    "<!--text--> text",
    "text <!--text-->",
    "text <!--",
    "--> text",
    "text --> <!--text--> text <!--text--> <!-- text",
    "text --> --> <!--text--> text <!--text--> <!-- <!-- text"
  ];
  for (const line of nonBlankLines) {
    t.true(!helpers.isBlankLine(line), line);
  }
});

test("forEachInlineCodeSpan", (t) => {
  t.plan(99);
  const testCases =
    [
      {
        "input": "`code`",
        "expecteds": [ [ "code", 0, 1, 1 ] ]
      },
      {
        "input": "text `code` text",
        "expecteds": [ [ "code", 0, 6, 1 ] ]
      },
      {
        "input": "text `code` text `edoc`",
        "expecteds": [
          [ "code", 0, 6, 1 ],
          [ "edoc", 0, 18, 1 ]
        ]
      },
      {
        "input": "text `code` text `edoc` text",
        "expecteds": [
          [ "code", 0, 6, 1 ],
          [ "edoc", 0, 18, 1 ]
        ]
      },
      {
        "input": "text ``code`code`` text",
        "expecteds": [ [ "code`code", 0, 7, 2 ] ]
      },
      {
        "input": "`code `` code`",
        "expecteds": [ [ "code `` code", 0, 1, 1 ] ]
      },
      {
        "input": "`code\\`text`",
        "expecteds": [ [ "code\\", 0, 1, 1 ] ]
      },
      {
        "input": "``\ncode\n``",
        "expecteds": [ [ "\ncode\n", 0, 2, 2 ] ]
      },
      {
        "input": "text\n`code`\ntext",
        "expecteds": [ [ "code", 1, 1, 1 ] ]
      },
      {
        "input": "text\ntext\n`code`\ntext\n`edoc`\ntext",
        "expecteds": [
          [ "code", 2, 1, 1 ],
          [ "edoc", 4, 1, 1 ]
        ]
      },
      {
        "input": "text `code\nedoc` text",
        "expecteds": [ [ "code\nedoc", 0, 6, 1 ] ]
      },
      {
        "input": "> text `code` text",
        "expecteds": [ [ "code", 0, 8, 1 ] ]
      },
      {
        "input": "> text\n> `code`\n> text",
        "expecteds": [ [ "code", 1, 3, 1 ] ]
      },
      {
        "input": "> text\n> `code\n> edoc`\n> text",
        "expecteds": [ [ "code\n> edoc", 1, 3, 1 ] ]
      },
      {
        "input": "```text``",
        "expecteds": []
      },
      {
        "input": "text `text text",
        "expecteds": []
      },
      {
        "input": "`text``code``",
        "expecteds": [ [ "code", 0, 7, 2 ] ]
      },
      {
        "input": "text \\` text `code`",
        "expecteds": [ [ "code", 0, 14, 1 ] ]
      },
      {
        "input": "text\\\n`code`",
        "expecteds": [ [ "code", 1, 1, 1 ] ]
      }
    ];
  for (const testCase of testCases) {
    const { input, expecteds } = testCase;
    forEachInlineCodeSpan(input, (code, line, column, ticks) => {
      // @ts-ignore
      const [ expectedCode, expectedLine, expectedColumn, expectedTicks ] =
        expecteds.shift();
      t.is(code, expectedCode, input);
      t.is(line, expectedLine, input);
      t.is(column, expectedColumn, input);
      t.is(ticks, expectedTicks, input);
    });
    t.is(expecteds.shift(), undefined, input);
  }
});

test("getPreferredLineEnding", (t) => {
  t.plan(21);
  const testCases = [
    [ "", "\n" ],
    [ "\r", "\r" ],
    [ "\n", "\n" ],
    [ "\r\n", "\r\n" ],
    [ "t\rt\nt", "\n" ],
    [ "t\nt\rt", "\n" ],
    [ "t\r\nt\nt", "\n" ],
    [ "t\nt\r\nt", "\n" ],
    [ "t\r\nt\rt", "\r\n" ],
    [ "t\rt\r\nt", "\r\n" ],
    [ "t\r\nt\rt\nt", "\n" ],
    [ "t\r\nt\r\nt\r\nt", "\r\n" ],
    [ "t\nt\nt\nt", "\n" ],
    [ "t\rt\rt\rt", "\r" ],
    [ "t\r\nt\nt\r\nt", "\r\n" ],
    [ "t\nt\r\nt\nt", "\n" ],
    [ "t\rt\t\rt", "\r" ]
  ];
  for (const testCase of testCases) {
    const [ input, expected ] = testCase;
    const actual = helpers.getPreferredLineEnding(input);
    t.is(actual, expected, "Incorrect line ending returned.");
  }
  // @ts-ignore
  t.is(helpers.getPreferredLineEnding("", null), "\n");
  t.is(helpers.getPreferredLineEnding("", { "EOL": "\n" }), "\n");
  t.is(helpers.getPreferredLineEnding("", { "EOL": "\r\n" }), "\r\n");
  t.is(helpers.getPreferredLineEnding("", { "EOL": "custom" }), "custom");
});

test("expandTildePath", (t) => {
  t.plan(17);
  const homedir = os.homedir();
  t.is(helpers.expandTildePath("", os), "");
  t.is(helpers.expandTildePath("", {}), "");
  // @ts-ignore
  t.is(helpers.expandTildePath("", null), "");
  t.is(
    path.resolve(helpers.expandTildePath("~", os)),
    homedir
  );
  // @ts-ignore
  t.is(helpers.expandTildePath("~", null), "~");
  t.is(helpers.expandTildePath("file", os), "file");
  // @ts-ignore
  t.is(helpers.expandTildePath("file", null), "file");
  t.is(helpers.expandTildePath("/file", os), "/file");
  // @ts-ignore
  t.is(helpers.expandTildePath("/file", null), "/file");
  t.is(
    path.resolve(helpers.expandTildePath("~/file", os)),
    path.join(homedir, "/file")
  );
  // @ts-ignore
  t.is(helpers.expandTildePath("~/file", null), "~/file");
  t.is(helpers.expandTildePath("dir/file", os), "dir/file");
  // @ts-ignore
  t.is(helpers.expandTildePath("dir/file", null), "dir/file");
  t.is(helpers.expandTildePath("/dir/file", os), "/dir/file");
  // @ts-ignore
  t.is(helpers.expandTildePath("/dir/file", null), "/dir/file");
  t.is(
    path.resolve(helpers.expandTildePath("~/dir/file", os)),
    path.join(homedir, "/dir/file")
  );
  // @ts-ignore
  t.is(helpers.expandTildePath("~/dir/file", null), "~/dir/file");
});

test("getReferenceLinkImageData().shortcuts", (t) => {
  t.plan(1);
  /** @type {import("markdownlint").Options} */
  const options = {
    "customRules": [
      {
        "names": [ "no-shortcut-links" ],
        "description": "-",
        "tags": [ "-" ],
        "parser": "none",
        "function":
          () => {
            // @ts-ignore
            const { shortcuts } = getReferenceLinkImageData();
            t.is(shortcuts.size, 0, [ ...shortcuts.keys() ].join(", "));
          }
      }
    ],
    "strings": {
      "no-shortcut-links": `
Full reference link: [text0][label]
Collapsed reference link: [label][]
Nested empty brackets: [text1[]](https://example.com/)
Missing close bracket, empty text: [text2[](https://example.com/)
Empty bracket pairs: [text3[]][]
Empty bracket pair: [text4[]]

[label]: https://example.com/label
      `
    }
  };
  return lint(options).then(() => null);
});

test("endOfLineHtmlEntityRe", (t) => {
  const entities = Object.keys(characterEntities);
  t.plan(entities.length);
  for (const entity of entities) {
    t.true(helpers.endOfLineHtmlEntityRe.test(`-&${entity};`), entity);
  }
});

test("endOfLineGemojiCodeRe", (t) => {
  const emojis = gemoji.flatMap((i) => i.names);
  t.plan(emojis.length);
  for (const emoji of emojis) {
    t.true(helpers.endOfLineGemojiCodeRe.test(`-:${emoji}:`), emoji);
  }
});

test("ellipsify", (t) => {
  t.is(helpers.ellipsify("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), "abcdefghijklmnopqrstuvwxyzABCD...");
  t.is(helpers.ellipsify("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", false, false), "abcdefghijklmnopqrstuvwxyzABCD...");
  t.is(helpers.ellipsify("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", true, false), "abcdefghijklmnopqrstuvwxyzABCD...");
  t.is(helpers.ellipsify("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", false, true), "...wxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
  t.is(helpers.ellipsify("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", true, true), "abcdefghijklmno...LMNOPQRSTUVWXYZ");
});

test("hasOverlap", (t) => {
  t.plan(32);
  /** @type {import("../helpers/helpers.cjs").FileRange[][]} */
  const trueTestCases = [
    // Same line
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 1 },
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 1 }
    ],
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 2 },
      { "startLine": 1, "endLine": 1, "startColumn": 2, "endColumn": 2 }
    ],
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 3 },
      { "startLine": 1, "endLine": 1, "startColumn": 2, "endColumn": 2 }
    ],
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 2 },
      { "startLine": 1, "endLine": 1, "startColumn": 2, "endColumn": 3 }
    ],
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 3 },
      { "startLine": 1, "endLine": 1, "startColumn": 2, "endColumn": 3 }
    ],
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 4 },
      { "startLine": 1, "endLine": 1, "startColumn": 2, "endColumn": 3 }
    ],
    // Common line
    [
      { "startLine": 1, "endLine": 2, "startColumn": 1, "endColumn": 2 },
      { "startLine": 2, "endLine": 2, "startColumn": 2, "endColumn": 4 }
    ],
    [
      { "startLine": 1, "endLine": 2, "startColumn": 1, "endColumn": 2 },
      { "startLine": 2, "endLine": 2, "startColumn": 1, "endColumn": 1 }
    ],
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 2 },
      { "startLine": 1, "endLine": 2, "startColumn": 2, "endColumn": 4 }
    ],
    // Common lines
    [
      { "startLine": 1, "endLine": 3, "startColumn": 1, "endColumn": 2 },
      { "startLine": 2, "endLine": 4, "startColumn": 3, "endColumn": 4 }
    ],
    [
      { "startLine": 1, "endLine": 4, "startColumn": 1, "endColumn": 2 },
      { "startLine": 2, "endLine": 3, "startColumn": 3, "endColumn": 4 }
    ]
  ];
  for (const trueTestCase of trueTestCases) {
    const [ rangeA, rangeB ] = trueTestCase;
    t.true(helpers.hasOverlap(rangeA, rangeB), JSON.stringify({ rangeA, rangeB }));
    t.true(helpers.hasOverlap(rangeB, rangeA), JSON.stringify({ rangeB, rangeA }));
  }
  const falseTestCases = [
    // Same line
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 1 },
      { "startLine": 1, "endLine": 1, "startColumn": 2, "endColumn": 2 }
    ],
    [
      { "startLine": 1, "endLine": 1, "startColumn": 1, "endColumn": 2 },
      { "startLine": 1, "endLine": 1, "startColumn": 3, "endColumn": 4 }
    ],
    // Common line
    [
      { "startLine": 1, "endLine": 2, "startColumn": 1, "endColumn": 2 },
      { "startLine": 2, "endLine": 3, "startColumn": 3, "endColumn": 4 }
    ],
    [
      { "startLine": 1, "endLine": 2, "startColumn": 4, "endColumn": 2 },
      { "startLine": 2, "endLine": 3, "startColumn": 4, "endColumn": 2 }
    ],
    // No common lines
    [
      { "startLine": 1, "endLine": 2, "startColumn": 1, "endColumn": 4 },
      { "startLine": 3, "endLine": 4, "startColumn": 2, "endColumn": 3 }
    ]
  ];
  for (const falseTestCase of falseTestCases) {
    const [ rangeA, rangeB ] = falseTestCase;
    t.false(helpers.hasOverlap(rangeA, rangeB), JSON.stringify({ rangeA, rangeB }));
    t.false(helpers.hasOverlap(rangeB, rangeA), JSON.stringify({ rangeB, rangeA }));
  }
});

test("formatLintResults", async(t) => {
  t.plan(2);
  t.deepEqual(formatLintResults(undefined), []);
  const lintResults = await lint({ "strings": { "content": "#  Heading\n<br/><!-- markdownlint-configure-file { \"MD033\": \"warning\" } -->" } });
  t.deepEqual(
    formatLintResults(lintResults),
    [
      "content:1:3 error MD019/no-multiple-space-atx Multiple spaces after hash on atx style heading [Context: \"#  Heading\"]",
      "content:1 error MD022/blanks-around-headings Headings should be surrounded by blank lines [Expected: 1; Actual: 0; Below] [Context: \"#  Heading\"]",
      "content:2:1 warning MD033/no-inline-html Inline HTML [Element: br]",
      "content:2:64 error MD047/single-trailing-newline Files should end with a single newline character"
    ]
  );
});

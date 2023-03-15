// @ts-check

"use strict";

const os = require("node:os");
const path = require("node:path");
const test = require("ava").default;
const helpers = require("../helpers");
const { markdownlint } = require("../lib/markdownlint").promises;

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

test("includesSorted", (t) => {
  t.plan(154);
  const inputs = [
    [ ],
    [ 8 ],
    [ 7, 11 ],
    [ 0, 1, 2, 3, 5, 8, 13 ],
    [ 2, 3, 5, 7, 11, 13, 17, 19 ],
    [ 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 ],
    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]
  ];
  for (const input of inputs) {
    for (let i = 0; i <= 21; i++) {
      t.is(helpers.includesSorted(input, i), input.includes(i));
    }
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
    helpers.forEachInlineCodeSpan(input, (code, line, column, ticks) => {
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
  t.is(helpers.getPreferredLineEnding("", null), "\n");
  t.is(helpers.getPreferredLineEnding("", { "EOL": "\n" }), "\n");
  t.is(helpers.getPreferredLineEnding("", { "EOL": "\r\n" }), "\r\n");
  t.is(helpers.getPreferredLineEnding("", { "EOL": "custom" }), "custom");
});

test("applyFix", (t) => {
  t.plan(4);
  const testCases = [
    [
      "Hello world.",
      {
        "editColumn": 12,
        "deleteCount": 1
      },
      undefined,
      "Hello world"
    ],
    [
      "Hello world.",
      {
        "editColumn": 13,
        "insertText": "\n"
      },
      undefined,
      "Hello world.\n"
    ],
    [
      "Hello world.",
      {
        "editColumn": 13,
        "insertText": "\n"
      },
      "\n",
      "Hello world.\n"
    ],
    [
      "Hello world.",
      {
        "editColumn": 13,
        "insertText": "\n"
      },
      "\r\n",
      "Hello world.\r\n"
    ]
  ];
  for (const testCase of testCases) {
    const [ line, fixInfo, lineEnding, expected ] = testCase;
    // @ts-ignore
    const actual = helpers.applyFix(line, fixInfo, lineEnding);
    t.is(actual, String(expected), "Incorrect fix applied.");
  }
});

test("applyFixes", (t) => {
  t.plan(30);
  const testCases = [
    [
      "Hello world.",
      [],
      "Hello world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {}
        }
      ],
      "Hello world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "insertText": "Very "
          }
        }
      ],
      "Very Hello world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 7,
            "insertText": "big "
          }
        }
      ],
      "Hello big world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "deleteCount": 6
          }
        }
      ],
      "world."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 7,
            "deleteCount": 5,
            "insertText": "there"
          }
        }
      ],
      "Hello there."
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 12,
            "deleteCount": 1
          }
        },
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 6,
            "deleteCount": 1
          }
        }
      ],
      "Helloworld"
    ],
    [
      "Hello world.",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 13,
            "insertText": " Hi."
          }
        }
      ],
      "Hello world. Hi."
    ],
    [
      "Hello\nworld",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "deleteCount": -1
          }
        }
      ],
      "world"
    ],
    [
      "Hello\nworld",
      [
        {
          "lineNumber": 2,
          "fixInfo": {
            "deleteCount": -1
          }
        }
      ],
      "Hello"
    ],
    [
      "Hello\nworld",
      [
        {
          "lineNumber": 2,
          "fixInfo": {
            "lineNumber": 1,
            "deleteCount": -1
          }
        }
      ],
      "world"
    ],
    [
      "Hello\nworld",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "lineNumber": 2,
            "deleteCount": -1
          }
        }
      ],
      "Hello"
    ],
    [
      "Hello world",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 4,
            "deleteCount": 1
          }
        },
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 10,
            "deleteCount": 1
          }
        }
      ],
      "Helo word"
    ],
    [
      "Hello world",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 10,
            "deleteCount": 1
          }
        },
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 4,
            "deleteCount": 1
          }
        }
      ],
      "Helo word"
    ],
    [
      "Hello\nworld",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "deleteCount": -1
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "Big "
          }
        }
      ],
      "world"
    ],
    [
      "Hello\nworld",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "deleteCount": -1
          }
        },
        {
          "fixInfo": {
            "lineNumber": 2,
            "deleteCount": -1
          }
        }
      ],
      ""
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "aa"
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "b"
          }
        }
      ],
      "aaHello world"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "a"
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "insertText": "bb"
          }
        }
      ],
      "bbHello world"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 6,
            "insertText": " big"
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 1
          }
        }
      ],
      "Hello big orld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 8,
            "deleteCount": 2
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 2
          }
        }
      ],
      "Hello wld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 2
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 8,
            "deleteCount": 2
          }
        }
      ],
      "Hello wld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 1,
            "insertText": "z"
          }
        }
      ],
      "Hello zorld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 1
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "insertText": "z"
          }
        }
      ],
      "Hello zorld"
    ],
    [
      "Hello world",
      [
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "insertText": "z"
          }
        },
        {
          "fixInfo": {
            "lineNumber": 1,
            "editColumn": 7,
            "deleteCount": 1
          }
        }
      ],
      "Hello zorld"
    ],
    [
      "Hello\nworld\nhello\rworld",
      [
        {
          "fixInfo": {
            "lineNumber": 4,
            "editColumn": 6,
            "insertText": "\n"
          }
        }
      ],
      "Hello\nworld\nhello\nworld\n"
    ],
    [
      "Hello\r\nworld\r\nhello\nworld",
      [
        {
          "fixInfo": {
            "lineNumber": 4,
            "editColumn": 6,
            "insertText": "\n"
          }
        }
      ],
      "Hello\r\nworld\r\nhello\r\nworld\r\n"
    ],
    [
      "Hello\rworld\rhello\nworld",
      [
        {
          "fixInfo": {
            "lineNumber": 4,
            "editColumn": 6,
            "insertText": "\n"
          }
        }
      ],
      "Hello\rworld\rhello\rworld\r"
    ],
    [
      "Hello\r\nworld",
      [
        {
          "lineNumber": 2,
          "fixInfo": {
            "editColumn": 6,
            "insertText": "\n\n"
          }
        }
      ],
      "Hello\r\nworld\r\n\r\n"
    ],
    [
      "Hello world",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "insertText": "x"
          }
        },
        {
          "lineNumber": 1,
          "fixInfo": {
            "deleteCount": -1
          }
        }
      ],
      ""
    ],
    [
      " hello world",
      [
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 1,
            "deleteCount": 1
          }
        },
        {
          "lineNumber": 1,
          "fixInfo": {
            "editColumn": 2,
            "deleteCount": 1,
            "insertText": "H"
          }
        }
      ],
      "Hello world"
    ]
  ];
  for (const testCase of testCases) {
    const [ input, errors, expected ] = testCase;
    // @ts-ignore
    const actual = helpers.applyFixes(input, errors);
    t.is(actual, String(expected), "Incorrect fix applied.");
  }
});

test("forEachLink", (t) => {
  t.plan(291);
  const testCases = [
    [
      "",
      []
    ],
    [
      "Text",
      []
    ],
    [
      "Text [text] (text) text",
      [ [ 5, "[text]", "[text]", undefined ] ]
    ],
    [
      "Text [text] text (text) text",
      [ [ 5, "[text]", "[text]", undefined ] ]
    ],
    [
      "Text [text] [text] text",
      [
        [ 5, "[text]", "[text]", undefined ],
        [ 12, "[text]", "[text]", undefined ]
      ]
    ],
    [
      "Text [text] text [text] text",
      [
        [ 5, "[text]", "[text]", undefined ],
        [ 17, "[text]", "[text]", undefined ]
      ]
    ],
    [
      "Text [link](destination) text",
      [ [ 5, "[link](destination)", "[link]", "(destination)" ] ]
    ],
    [
      "Text [link0](destination0) text [link1](destination1) text",
      [
        [ 5, "[link0](destination0)", "[link0]", "(destination0)" ],
        [ 32, "[link1](destination1)", "[link1]", "(destination1)" ]
      ]
    ],
    [
      "Text [link0] text [link1](destination1) text [link2] text",
      [
        [ 5, "[link0]", "[link0]", undefined ],
        [ 18, "[link1](destination1)", "[link1]", "(destination1)" ],
        [ 45, "[link2]", "[link2]", undefined ]
      ]
    ],
    [
      "Text [link0](destination0) text [link1] text [link2](destination2) text",
      [
        [ 5, "[link0](destination0)", "[link0]", "(destination0)" ],
        [ 32, "[link1]", "[link1]", undefined ],
        [ 45, "[link2](destination2)", "[link2]", "(destination2)" ]
      ]
    ],
    [
      "Text [link0][destination0] text [link1] text [link2](destination2) text",
      [
        [ 5, "[link0][destination0]", "[link0]", "[destination0]" ],
        [ 32, "[link1]", "[link1]", undefined ],
        [ 45, "[link2](destination2)", "[link2]", "(destination2)" ]
      ]
    ],
    [
      "Text [link0](destination0) text [link1] text [link2][destination2] text",
      [
        [ 5, "[link0](destination0)", "[link0]", "(destination0)" ],
        [ 32, "[link1]", "[link1]", undefined ],
        [ 45, "[link2][destination2]", "[link2]", "[destination2]" ]
      ]
    ],
    [
      "Text [link](destination \"title\") text",
      [
        [
          5,
          "[link](destination \"title\")",
          "[link]",
          "(destination \"title\")"
        ]
      ]
    ],
    [
      "Text [link](<destination> \"title\") text",
      [
        [
          5,
          "[link](<destination> \"title\")",
          "[link]",
          "(<destination> \"title\")"
        ]
      ]
    ],
    [
      "Text [link](destination \"ti\\\"tle\") text",
      [
        [
          5,
          "[link](destination \"ti\\\"tle\")",
          "[link]",
          "(destination \"ti\\\"tle\")"
        ]
      ]
    ],
    [
      "Text [link](destination 'title') text",
      [
        [
          5,
          "[link](destination 'title')",
          "[link]",
          "(destination 'title')"
        ]
      ]
    ],
    [
      "Text [link](destination (title)) text",
      [
        [
          5,
          "[link](destination (title))",
          "[link]",
          "(destination (title))"
        ]
      ]
    ],
    [
      "Text [link](\"title\") text",
      [ [ 5, "[link](\"title\")", "[link]", "(\"title\")" ] ]
    ],
    [
      "[]()",
      [ [ 0, "[]()", "[]", "()" ] ]
    ],
    [
      "[l](d)",
      [ [ 0, "[l](d)", "[l]", "(d)" ] ]
    ],
    [
      "Text [li[nk](dest) text",
      [ [ 8, "[nk](dest)", "[nk]", "(dest)" ] ]
    ],
    [
      "Text [li\\[nk](dest) text",
      [ [ 5, "[li\\[nk](dest)", "[li\\[nk]", "(dest)" ] ]
    ],
    [
      "Text [li]nk](dest) text",
      [ [ 5, "[li]", "[li]", undefined ] ]
    ],
    [
      "Text [li\\]nk](dest) text",
      [ [ 5, "[li\\]nk](dest)", "[li\\]nk]", "(dest)" ] ]
    ],
    [
      "Text [l[in]k](dest) text",
      [ [ 5, "[l[in]k](dest)", "[l[in]k]", "(dest)" ] ]
    ],
    [
      "Text [li(nk](dest) text",
      [ [ 5, "[li(nk](dest)", "[li(nk]", "(dest)" ] ]
    ],
    [
      "Text [li)nk](dest) text",
      [ [ 5, "[li)nk](dest)", "[li)nk]", "(dest)" ] ]
    ],
    [
      "Text [l(in)k](dest) text",
      [ [ 5, "[l(in)k](dest)", "[l(in)k]", "(dest)" ] ]
    ],
    [
      "Text [link](de(st) text",
      [ [ 5, "[link]", "[link]", undefined ] ]
    ],
    [
      "Text [link](de\\(st) text",
      [ [ 5, "[link](de\\(st)", "[link]", "(de\\(st)" ] ]
    ],
    [
      "Text [link](de)st) text",
      [ [ 5, "[link](de)", "[link]", "(de)" ] ]
    ],
    [
      "Text [link](de\\)st) text",
      [ [ 5, "[link](de\\)st)", "[link]", "(de\\)st)" ] ]
    ],
    [
      "Text [link](d(es)t) text",
      [ [ 5, "[link](d(es)t)", "[link]", "(d(es)t)" ] ]
    ],
    [
      "Text [link]() text",
      [ [ 5, "[link]()", "[link]", "()" ] ]
    ],
    [
      "Text [link](#) text",
      [ [ 5, "[link](#)", "[link]", "(#)" ] ]
    ],
    [
      "Text [link](<de) text",
      [ [ 5, "[link]", "[link]", undefined ] ]
    ],
    [
      "Text [link](<de)st> text",
      [ [ 5, "[link]", "[link]", undefined ] ]
    ],
    [
      "Text [link](<>) text",
      [ [ 5, "[link](<>)", "[link]", "(<>)" ] ]
    ],
    [
      "Text [link](<dest>) text",
      [ [ 5, "[link](<dest>)", "[link]", "(<dest>)" ] ]
    ],
    [
      "Text [link](<de st>) text",
      [ [ 5, "[link](<de st>)", "[link]", "(<de st>)" ] ]
    ],
    [
      "Text [link](<de)st>) text",
      [ [ 5, "[link](<de)st>)", "[link]", "(<de)st>)" ] ]
    ],
    [
      "Text [<link](dest) text",
      [ [ 5, "[<link](dest)", "[<link]", "(dest)" ] ]
    ],
    [
      "Text [<link>](dest) text",
      [ [ 5, "[<link>](dest)", "[<link>]", "(dest)" ] ]
    ],
    [
      "Text [<link>](<dest) text",
      [ [ 5, "[<link>]", "[<link>]", undefined ] ]
    ],
    [
      "Text [<link>](<dest>) text",
      [ [ 5, "[<link>](<dest>)", "[<link>]", "(<dest>)" ] ]
    ],
    [
      "Text [[[[l[i]n[k]](dest) text",
      [ [ 8, "[l[i]n[k]](dest)", "[l[i]n[k]]", "(dest)" ] ]
    ],
    [
      "Text [link](d(e(st))) text",
      [ [ 5, "[link](d(e(st)))", "[link]", "(d(e(st)))" ] ]
    ],
    [
      "Text [link](d(e(st)) text",
      [ [ 5, "[link]", "[link]", undefined ] ]
    ],
    [
      "Text [link](<d(e(st)>) text",
      [ [ 5, "[link](<d(e(st)>)", "[link]", "(<d(e(st)>)" ] ]
    ],
    [
      "Text [link][reference] text",
      [ [ 5, "[link][reference]", "[link]", "[reference]" ] ]
    ],
    [
      "Text [link][refer]ence] text",
      [ [ 5, "[link][refer]", "[link]", "[refer]" ] ]
    ]
  ];
  for (const testCase of testCases) {
    const [ markdown, matches ] = testCase;
    helpers.forEachLink(String(markdown), (idx, lnk, txt, des) => {
      // @ts-ignore
      const match = matches.shift();
      const [ index, link, text, destination ] = match;
      t.is(idx, index, String(markdown));
      t.is(lnk, link, String(markdown));
      t.is(txt, text, String(markdown));
      t.is(des, destination, String(markdown));
    });
    t.is(matches.length, 0, "Missing match");
  }
});

test("htmlElementRanges", (t) => {
  t.plan(1);
  const params = {
    "lines": [
      "# Heading",
      "",
      "Text text text",
      "text <a id='id'/> text",
      "text text text",
      "",
      "<p>",
      "Text <em>text</em> text",
      "</p>",
      "",
      "```",
      "<br/>",
      "```",
      "",
      "Text `<br/>` text",
      "text <br/> text"
    ],
    "parsers": {
      "markdownit": {
        "tokens": [
          {
            "type": "code_block",
            "map": [ 10, 12 ]
          }
        ]
      }
    }
  };
  const expected = [
    [ 3, 5, 12 ],
    [ 6, 0, 3 ],
    [ 7, 5, 4 ],
    [ 14, 6, 5 ],
    [ 15, 5, 5 ]
  ];
  const lineMetadata = helpers.getLineMetadata(params);
  const actual = helpers.htmlElementRanges(params, lineMetadata);
  t.deepEqual(actual, expected);
});

test("expandTildePath", (t) => {
  t.plan(17);
  const homedir = os.homedir();
  t.is(helpers.expandTildePath("", os), "");
  t.is(helpers.expandTildePath("", {}), "");
  t.is(helpers.expandTildePath("", null), "");
  t.is(
    path.resolve(helpers.expandTildePath("~", os)),
    homedir
  );
  t.is(helpers.expandTildePath("~", null), "~");
  t.is(helpers.expandTildePath("file", os), "file");
  t.is(helpers.expandTildePath("file", null), "file");
  t.is(helpers.expandTildePath("/file", os), "/file");
  t.is(helpers.expandTildePath("/file", null), "/file");
  t.is(
    path.resolve(helpers.expandTildePath("~/file", os)),
    path.join(homedir, "/file")
  );
  t.is(helpers.expandTildePath("~/file", null), "~/file");
  t.is(helpers.expandTildePath("dir/file", os), "dir/file");
  t.is(helpers.expandTildePath("dir/file", null), "dir/file");
  t.is(helpers.expandTildePath("/dir/file", os), "/dir/file");
  t.is(helpers.expandTildePath("/dir/file", null), "/dir/file");
  t.is(
    path.resolve(helpers.expandTildePath("~/dir/file", os)),
    path.join(homedir, "/dir/file")
  );
  t.is(helpers.expandTildePath("~/dir/file", null), "~/dir/file");
});

test("getReferenceLinkImageData().shortcuts", (t) => {
  t.plan(1);
  const options = {
    "customRules": [
      {
        "names": [ "no-shortcut-links" ],
        "description": "-",
        "tags": [ "-" ],
        "function":
          (params) => {
            const { shortcuts } =
              helpers.getReferenceLinkImageData(params);
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

[label]: https://example.com/label
      `
    }
  };
  return markdownlint(options).then(() => null);
});

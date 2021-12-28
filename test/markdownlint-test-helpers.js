// @ts-check

"use strict";

const os = require("os");
const test = require("ava").default;
const helpers = require("../helpers");

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
    "<!--.........-->",
    " <!--.........-->",
    "  <!--.........-->",
    "<!--......-->",
    "<!--....-->",
    "<!--.-->",
    "<!--....-->",
    "<!---->",
    "<!--.....-->",
    "<!--.........-->",
    "<!--..-->",
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
    "......",
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
    "text<!--..............-->text",
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
    "    <!-- indented code block -->"
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
    "<!--......--> -->",
    "<!--......--> -->",
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
    "<!-- markdownlint-disable MD010 -->",
    "text<!--....-->text",
    "text<!-- markdownlint-disable MD010 -->text",
    "text<!--....-->text"
  ];
  const actual = helpers.clearHtmlCommentText(embeddedComments.join("\n"));
  const expected = embeddedResult.join("\n");
  t.is(actual, expected);
});

test("unescapeMarkdown", (t) => {
  t.plan(7);
  // Test cases from https://spec.commonmark.org/0.29/#backslash-escapes
  const testCases = [
    [
      "\\!\\\"\\#\\$\\%\\&\\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;" +
        "\\<\\=\\>\\?\\@\\[\\\\\\]\\^\\_\\`\\{\\|\\}\\~",
      "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    ],
    [
      "\\→\\A\\a\\ \\3\\φ\\«",
      "\\→\\A\\a\\ \\3\\φ\\«"
    ],
    [
      `\\*not emphasized*
\\<br/> not a tag
\\[not a link](/foo)
\\\`not code\`
1\\. not a list
\\* not a list
\\# not a heading
\\[foo]: /url "not a reference"
\\&ouml; not a character entity`,
      `*not emphasized*
<br/> not a tag
[not a link](/foo)
\`not code\`
1. not a list
* not a list
# not a heading
[foo]: /url "not a reference"
&ouml; not a character entity`
    ],
    [
      "\\\\*emphasis*",
      "\\*emphasis*"
    ],
    [
      `foo\\
bar`,
      `foo\\
bar`
    ],
    [
      "Text \\<",
      "Text _",
      "_"
    ],
    [
      "Text \\\\<",
      "Text _<",
      "_"
    ]
  ];
  testCases.forEach(function forTestCase(testCase) {
    const [ markdown, expected, replacement ] = testCase;
    const actual = helpers.unescapeMarkdown(markdown, replacement);
    t.is(actual, expected);
  });
});

test("isBlankLine", (t) => {
  t.plan(29);
  const blankLines = [
    null,
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
    "-->"
  ];
  blankLines.forEach((line) => t.true(helpers.isBlankLine(line), line || ""));
  const nonBlankLines = [
    "text",
    " text ",
    ".",
    "> .",
    "<!--text--> text",
    "text <!--text-->",
    "text <!--",
    "--> text"
  ];
  nonBlankLines.forEach((line) => t.true(!helpers.isBlankLine(line), line));
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
  inputs.forEach((input) => {
    for (let i = 0; i <= 21; i++) {
      t.is(helpers.includesSorted(input, i), input.includes(i));
    }
  });
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
  testCases.forEach((testCase) => {
    const { input, expecteds } = testCase;
    helpers.forEachInlineCodeSpan(input, (code, line, column, ticks) => {
      const [ expectedCode, expectedLine, expectedColumn, expectedTicks ] =
        expecteds.shift();
      t.is(code, expectedCode, input);
      t.is(line, expectedLine, input);
      t.is(column, expectedColumn, input);
      t.is(ticks, expectedTicks, input);
    });
    t.is(expecteds.length, 0, "length");
  });
});

test("getPreferredLineEnding", (t) => {
  t.plan(19);
  const testCases = [
    [ "", os.EOL ],
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
  testCases.forEach((testCase) => {
    const [ input, expected ] = testCase;
    const actual = helpers.getPreferredLineEnding(input);
    t.is(actual, expected, "Incorrect line ending returned.");
  });
  t.is(
    helpers.getPreferredLineEnding("", "linux"),
    "\n",
    "Incorrect line ending for linux"
  );
  t.is(
    helpers.getPreferredLineEnding("", "win32"),
    "\r\n",
    "Incorrect line ending for win32"
  );
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
  testCases.forEach((testCase) => {
    const [ line, fixInfo, lineEnding, expected ] = testCase;
    // @ts-ignore
    const actual = helpers.applyFix(line, fixInfo, lineEnding);
    t.is(actual, expected, "Incorrect fix applied.");
  });
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
  testCases.forEach((testCase) => {
    const [ input, errors, expected ] = testCase;
    const actual = helpers.applyFixes(input, errors);
    t.is(actual, expected, "Incorrect fix applied.");
  });
});

test("deepFreeze", (t) => {
  t.plan(6);
  const obj = {
    "prop": true,
    "func": () => true,
    "sub": {
      "prop": [ 1 ],
      "sub": {
        "prop": "one"
      }
    }
  };
  t.is(helpers.deepFreeze(obj), obj, "Did not return object.");
  [
    () => {
      obj.prop = false;
    },
    () => {
      obj.func = () => false;
    },
    () => {
      obj.sub.prop = [];
    },
    () => {
      obj.sub.prop[0] = 0;
    },
    () => {
      obj.sub.sub.prop = "zero";
    }
  ].forEach((scenario) => {
    t.throws(scenario, null, "Assigned to frozen object.");
  });
});

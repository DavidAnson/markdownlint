// @ts-check

import test from "ava";
import { applyFix, applyFixes } from "markdownlint";

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
    const actual = applyFix(line, fixInfo, lineEnding);
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
    const actual = applyFixes(input, errors);
    t.is(actual, String(expected), "Incorrect fix applied.");
  }
});

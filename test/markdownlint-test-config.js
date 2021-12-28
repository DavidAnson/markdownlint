// @ts-check

"use strict";

const path = require("path");
const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");

test.cb("configSingle", (t) => {
  t.plan(2);
  markdownlint.readConfig("./test/config/config-child.json",
    function callback(err, actual) {
      t.falsy(err);
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configAbsolute", (t) => {
  t.plan(2);
  markdownlint.readConfig(path.join(__dirname, "config", "config-child.json"),
    function callback(err, actual) {
      t.falsy(err);
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configMultiple", (t) => {
  t.plan(2);
  markdownlint.readConfig("./test/config/config-grandparent.json",
    function callback(err, actual) {
      t.falsy(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configMultipleWithRequireResolve", (t) => {
  t.plan(2);
  markdownlint.readConfig("./test/config/config-packageparent.json",
    function callback(err, actual) {
      t.falsy(err);
      const expected = {
        ...require("./node_modules/pseudo-package/config-frompackage.json"),
        ...require("./config/config-packageparent.json")
      };
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configCustomFileSystem", (t) => {
  t.plan(5);
  const file = path.resolve("/dir/file.json");
  const extended = path.resolve("/dir/extended.json");
  const fileContent = {
    "extends": extended,
    "default": true,
    "MD001": false
  };
  const extendedContent = {
    "MD001": true,
    "MD002": true
  };
  const fsApi = {
    "access": (p, m, cb) => {
      t.is(p, extended);
      return (cb || m)();
    },
    "readFile": (p, o, cb) => {
      switch (p) {
        case file:
          t.is(p, file);
          return cb(null, JSON.stringify(fileContent));
        case extended:
          t.is(p, extended);
          return cb(null, JSON.stringify(extendedContent));
        default:
          return t.fail();
      }
    }
  };
  markdownlint.readConfig(
    file,
    null,
    fsApi,
    function callback(err, actual) {
      t.falsy(err);
      const expected = {
        ...extendedContent,
        ...fileContent
      };
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configBadFile", (t) => {
  t.plan(4);
  markdownlint.readConfig("./test/config/config-badfile.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad file.");
      t.true(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      t.is(err.code, "ENOENT", "Error code for bad file not ENOENT.");
      t.true(!result, "Got result for bad file.");
      t.end();
    });
});

test.cb("configBadChildFile", (t) => {
  t.plan(4);
  markdownlint.readConfig("./test/config/config-badchildfile.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child file.");
      t.true(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      t.is(err.code, "ENOENT",
        "Error code for bad child file not ENOENT.");
      t.true(!result, "Got result for bad child file.");
      t.end();
    });
});

test.cb("configBadChildPackage", (t) => {
  t.plan(4);
  markdownlint.readConfig("./test/config/config-badchildpackage.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child package.");
      t.true(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      t.is(err.code, "ENOENT",
        "Error code for bad child package not ENOENT.");
      t.true(!result, "Got result for bad child package.");
      t.end();
    });
});

test.cb("configBadJson", (t) => {
  t.plan(3);
  markdownlint.readConfig("./test/config/config-badjson.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad JSON.");
      t.true(err instanceof Error, "Error not instance of Error.");
      t.true(!result, "Got result for bad JSON.");
      t.end();
    });
});

test.cb("configBadChildJson", (t) => {
  t.plan(3);
  markdownlint.readConfig("./test/config/config-badchildjson.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child JSON.");
      t.true(err instanceof Error, "Error not instance of Error.");
      t.true(!result, "Got result for bad child JSON.");
      t.end();
    });
});

test.cb("configSingleYaml", (t) => {
  t.plan(2);
  markdownlint.readConfig(
    "./test/config/config-child.yaml",
    // @ts-ignore
    [ require("js-yaml").load ],
    function callback(err, actual) {
      t.falsy(err);
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configMultipleYaml", (t) => {
  t.plan(2);
  markdownlint.readConfig(
    "./test/config/config-grandparent.yaml",
    // @ts-ignore
    [ require("js-yaml").load ],
    function callback(err, actual) {
      t.falsy(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configMultipleHybrid", (t) => {
  t.plan(2);
  markdownlint.readConfig(
    "./test/config/config-grandparent-hybrid.yaml",
    // @ts-ignore
    [ JSON.parse, require("toml").parse, require("js-yaml").load ],
    function callback(err, actual) {
      t.falsy(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      delete expected.extends;
      t.like(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configBadHybrid", (t) => {
  t.plan(4);
  markdownlint.readConfig(
    "./test/config/config-badcontent.txt",
    // @ts-ignore
    [ JSON.parse, require("toml").parse, require("js-yaml").load ],
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child JSON.");
      t.true(err instanceof Error, "Error not instance of Error.");
      t.truthy(err.message.match(
        // eslint-disable-next-line max-len
        /^Unable to parse '[^']*'; Parser \d+: Unexpected token \S+ in JSON at position \d+;/
      ), "Error message unexpected.");
      t.true(!result, "Got result for bad child JSON.");
      t.end();
    });
});

test("configSingleSync", (t) => {
  t.plan(1);
  const actual = markdownlint.readConfigSync("./test/config/config-child.json");
  const expected = require("./config/config-child.json");
  t.deepEqual(actual, expected, "Config object not correct.");
});

test("configAbsoluteSync", (t) => {
  t.plan(1);
  const actual = markdownlint.readConfigSync(
    path.join(__dirname, "config", "config-child.json"));
  const expected = require("./config/config-child.json");
  t.deepEqual(actual, expected, "Config object not correct.");
});

test("configMultipleSync", (t) => {
  t.plan(1);
  const actual =
    markdownlint.readConfigSync("./test/config/config-grandparent.json");
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  t.deepEqual(actual, expected, "Config object not correct.");
});

test("configBadFileSync", (t) => {
  t.plan(1);
  t.throws(
    function badFileCall() {
      markdownlint.readConfigSync("./test/config/config-badfile.json");
    },
    {
      "message": /ENOENT/
    },
    "Did not get correct exception for bad file."
  );
});

test("configBadChildFileSync", (t) => {
  t.plan(1);
  t.throws(
    function badChildFileCall() {
      markdownlint.readConfigSync("./test/config/config-badchildfile.json");
    },
    {
      "message": /ENOENT/
    },
    "Did not get correct exception for bad child file."
  );
});

test("configBadJsonSync", (t) => {
  t.plan(1);
  t.throws(
    function badJsonCall() {
      markdownlint.readConfigSync("./test/config/config-badjson.json");
    },
    {
      "message":
        // eslint-disable-next-line max-len
        /Unable to parse '[^']*'; Parser \d+: Unexpected token \S+ in JSON at position \d+/
    },
    "Did not get correct exception for bad JSON."
  );
});

test("configBadChildJsonSync", (t) => {
  t.plan(1);
  t.throws(
    function badChildJsonCall() {
      markdownlint.readConfigSync("./test/config/config-badchildjson.json");
    },
    {
      "message":
        // eslint-disable-next-line max-len
        /Unable to parse '[^']*'; Parser \d+: Unexpected token \S+ in JSON at position \d+/
    },
    "Did not get correct exception for bad child JSON."
  );
});

test("configSingleYamlSync", (t) => {
  t.plan(1);
  const actual = markdownlint.readConfigSync(
    // @ts-ignore
    "./test/config/config-child.yaml", [ require("js-yaml").load ]);
  const expected = require("./config/config-child.json");
  t.deepEqual(actual, expected, "Config object not correct.");
});

test("configMultipleYamlSync", (t) => {
  t.plan(1);
  const actual = markdownlint.readConfigSync(
    // @ts-ignore
    "./test/config/config-grandparent.yaml", [ require("js-yaml").load ]);
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  t.deepEqual(actual, expected, "Config object not correct.");
});

test("configMultipleHybridSync", (t) => {
  t.plan(1);
  const actual = markdownlint.readConfigSync(
    "./test/config/config-grandparent-hybrid.yaml",
    // @ts-ignore
    [ JSON.parse, require("toml").parse, require("js-yaml").load ]);
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  delete expected.extends;
  t.like(actual, expected, "Config object not correct.");
});

test("configCustomFileSystemSync", (t) => {
  t.plan(4);
  const file = path.resolve("/dir/file.json");
  const extended = path.resolve("/dir/extended.json");
  const fileContent = {
    "extends": extended,
    "default": true,
    "MD001": false
  };
  const extendedContent = {
    "MD001": true,
    "MD002": true
  };
  const fsApi = {
    "accessSync": (p) => {
      t.is(p, extended);
    },
    "readFileSync": (p) => {
      switch (p) {
        case file:
          t.is(p, file);
          return JSON.stringify(fileContent);
        case extended:
          t.is(p, extended);
          return JSON.stringify(extendedContent);
        default:
          return t.fail();
      }
    }
  };
  const actual = markdownlint.readConfigSync(file, null, fsApi);
  const expected = {
    ...extendedContent,
    ...fileContent
  };
  delete expected.extends;
  t.deepEqual(actual, expected, "Config object not correct.");
});

test("configBadHybridSync", (t) => {
  t.plan(1);
  t.throws(
    function badHybridCall() {
      markdownlint.readConfigSync(
        "./test/config/config-badcontent.txt",
        // @ts-ignore
        [ JSON.parse, require("toml").parse, require("js-yaml").load ]);
    },
    {
      // eslint-disable-next-line max-len
      "message": /^Unable to parse '[^']*'; Parser \d+: Unexpected token \S+ in JSON at position \d+;/
    },
    "Did not get correct exception for bad content."
  );
});

test.cb("configSinglePromise", (t) => {
  t.plan(1);
  markdownlint.promises.readConfig("./test/config/config-child.json")
    .then((actual) => {
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configCustomFileSystemPromise", (t) => {
  t.plan(4);
  const file = path.resolve("/dir/file.json");
  const extended = path.resolve("/dir/extended.json");
  const fileContent = {
    "extends": extended,
    "default": true,
    "MD001": false
  };
  const extendedContent = {
    "MD001": true,
    "MD002": true
  };
  const fsApi = {
    "access": (p, m, cb) => {
      t.is(p, extended);
      return (cb || m)();
    },
    "readFile": (p, o, cb) => {
      switch (p) {
        case file:
          t.is(p, file);
          return cb(null, JSON.stringify(fileContent));
        case extended:
          t.is(p, extended);
          return cb(null, JSON.stringify(extendedContent));
        default:
          return t.fail();
      }
    }
  };
  markdownlint.promises.readConfig(file, null, fsApi)
    .then((actual) => {
      const expected = {
        ...extendedContent,
        ...fileContent
      };
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      t.end();
    });
});

test.cb("configBadFilePromise", (t) => {
  t.plan(2);
  markdownlint.promises.readConfig("./test/config/config-badfile.json")
    .then(
      null,
      (error) => {
        t.truthy(error, "Did not get an error for bad JSON.");
        t.true(error instanceof Error, "Error not instance of Error.");
        t.end();
      }
    );
});

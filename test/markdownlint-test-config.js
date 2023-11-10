// @ts-check

"use strict";

const os = require("node:os");
const path = require("node:path");
const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");

const sameFileSystem = (path.relative(os.homedir(), __dirname) !== __dirname);

test("configSingle", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint.readConfig("./test/config/config-child.json",
    function callback(err, actual) {
      t.falsy(err);
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configAbsolute", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint.readConfig(path.join(__dirname, "config", "config-child.json"),
    function callback(err, actual) {
      t.falsy(err);
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

if (sameFileSystem) {
  test("configTilde", (t) => new Promise((resolve) => {
    t.plan(2);
    markdownlint.readConfig(
      `~/${path.relative(os.homedir(), "./test/config/config-child.json")}`,
      function callback(err, actual) {
        t.falsy(err);
        const expected = require("./config/config-child.json");
        t.deepEqual(actual, expected, "Config object not correct.");
        resolve();
      });
  }));
}

test("configMultiple", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint.readConfig("./test/config/config-grandparent.json",
    function callback(err, actual) {
      t.falsy(err);
      const expected = {
        ...require("./config/config-child.json"),
        ...require("./config/config-parent.json"),
        ...require("./config/config-grandparent.json")
      };
      // @ts-ignore
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configMultipleWithRequireResolve", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint.readConfig("./test/config/config-packageparent.json",
    function callback(err, actual) {
      t.falsy(err);
      const expected = {
        ...require("./node_modules/pseudo-package/config-frompackage.json"),
        ...require("./config/config-packageparent.json")
      };
      // @ts-ignore
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configCustomFileSystem", (t) => new Promise((resolve) => {
  t.plan(3);
  const file = "/dir/file.json";
  const extended = "~/dir/extended.json";
  const expanded = path.join(os.homedir(), extended.slice(1));
  const fileContent = {
    "extends": extended,
    "default": true,
    "MD001": false
  };
  const extendedContent = {
    "MD001": true,
    "MD041": true
  };
  const fsApi = {
    "access": (p, m, cb) => {
      t.is(p, expanded);
      return (cb || m)();
    },
    "readFile": (p, o, cb) => {
      if (p === file) {
        return cb(null, JSON.stringify(fileContent));
      } else if (p === expanded) {
        return cb(null, JSON.stringify(extendedContent));
      }
      return t.fail(p);
    }
  };
  markdownlint.readConfig(
    file,
    // @ts-ignore
    null,
    fsApi,
    function callback(err, actual) {
      t.falsy(err);
      const expected = {
        ...extendedContent,
        ...fileContent
      };
      // @ts-ignore
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configBadFile", (t) => new Promise((resolve) => {
  t.plan(4);
  markdownlint.readConfig("./test/config/config-badfile.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad file.");
      t.true(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      t.is(err.code, "ENOENT", "Error code for bad file not ENOENT.");
      t.true(!result, "Got result for bad file.");
      resolve();
    });
}));

test("configBadChildFile", (t) => new Promise((resolve) => {
  t.plan(4);
  markdownlint.readConfig("./test/config/config-badchildfile.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child file.");
      t.true(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      t.is(err.code, "ENOENT",
        "Error code for bad child file not ENOENT.");
      t.true(!result, "Got result for bad child file.");
      resolve();
    });
}));

test("configBadChildPackage", (t) => new Promise((resolve) => {
  t.plan(4);
  markdownlint.readConfig("./test/config/config-badchildpackage.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child package.");
      t.true(err instanceof Error, "Error not instance of Error.");
      // @ts-ignore
      t.is(err.code, "ENOENT",
        "Error code for bad child package not ENOENT.");
      t.true(!result, "Got result for bad child package.");
      resolve();
    });
}));

test("configBadJson", (t) => new Promise((resolve) => {
  t.plan(3);
  markdownlint.readConfig("./test/config/config-badjson.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad JSON.");
      t.true(err instanceof Error, "Error not instance of Error.");
      t.true(!result, "Got result for bad JSON.");
      resolve();
    });
}));

test("configBadChildJson", (t) => new Promise((resolve) => {
  t.plan(3);
  markdownlint.readConfig("./test/config/config-badchildjson.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child JSON.");
      t.true(err instanceof Error, "Error not instance of Error.");
      t.true(!result, "Got result for bad child JSON.");
      resolve();
    });
}));

test("configSingleYaml", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint.readConfig(
    "./test/config/config-child.yaml",
    // @ts-ignore
    [ require("js-yaml").load ],
    function callback(err, actual) {
      t.falsy(err);
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configMultipleYaml", (t) => new Promise((resolve) => {
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
      // @ts-ignore
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configMultipleHybrid", (t) => new Promise((resolve) => {
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
      // @ts-ignore
      delete expected.extends;
      t.like(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configBadHybrid", (t) => new Promise((resolve) => {
  t.plan(4);
  markdownlint.readConfig(
    "./test/config/config-badcontent.txt",
    // @ts-ignore
    [ JSON.parse, require("toml").parse, require("js-yaml").load ],
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child JSON.");
      t.true(err instanceof Error, "Error not instance of Error.");
      t.truthy(err.message.match(
        /^Unable to parse '[^']*'; Parser \d+: (Unexpected token|Expected property name)/
      ), "Error message unexpected.");
      t.true(!result, "Got result for bad child JSON.");
      resolve();
    });
}));

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

if (sameFileSystem) {
  test("configTildeSync", (t) => {
    t.plan(1);
    const actual = markdownlint.readConfigSync(
      `~/${path.relative(os.homedir(), "./test/config/config-child.json")}`);
    const expected = require("./config/config-child.json");
    t.deepEqual(actual, expected, "Config object not correct.");
  });
}

test("configMultipleSync", (t) => {
  t.plan(1);
  const actual =
    markdownlint.readConfigSync("./test/config/config-grandparent.json");
  const expected = {
    ...require("./config/config-child.json"),
    ...require("./config/config-parent.json"),
    ...require("./config/config-grandparent.json")
  };
  // @ts-ignore
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
        /Unable to parse '[^']*'; Parser \d+: (Unexpected token|Expected property name)/
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
        /Unable to parse '[^']*'; Parser \d+: (Unexpected token|Expected property name)/
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
  // @ts-ignore
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
  // @ts-ignore
  delete expected.extends;
  t.like(actual, expected, "Config object not correct.");
});

test("configCustomFileSystemSync", (t) => {
  t.plan(2);
  const file = "/dir/file.json";
  const extended = "~/dir/extended.json";
  const expanded = path.join(os.homedir(), extended.slice(1));
  const fileContent = {
    "extends": extended,
    "default": true,
    "MD001": false
  };
  const extendedContent = {
    "MD001": true,
    "MD041": true
  };
  const fsApi = {
    "accessSync": (p) => {
      t.is(p, expanded);
    },
    "readFileSync": (p) => {
      if (p === file) {
        return JSON.stringify(fileContent);
      } else if (p === expanded) {
        return JSON.stringify(extendedContent);
      }
      return t.fail(p);
    }
  };
  const actual = markdownlint.readConfigSync(file, undefined, fsApi);
  const expected = {
    ...extendedContent,
    ...fileContent
  };
  // @ts-ignore
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
      "message": /^Unable to parse '[^']*'; Parser \d+: (Unexpected token|Expected property name)/
    },
    "Did not get correct exception for bad content."
  );
});

test("configSinglePromise", (t) => new Promise((resolve) => {
  t.plan(1);
  markdownlint.promises.readConfig("./test/config/config-child.json")
    .then((actual) => {
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configCustomFileSystemPromise", (t) => new Promise((resolve) => {
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
    "MD041": true
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
  markdownlint.promises.readConfig(file, undefined, fsApi)
    .then((actual) => {
      const expected = {
        ...extendedContent,
        ...fileContent
      };
      // @ts-ignore
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configBadFilePromise", (t) => new Promise((resolve) => {
  t.plan(2);
  markdownlint.promises.readConfig("./test/config/config-badfile.json")
    .then(
      null,
      (error) => {
        t.truthy(error, "Did not get an error for bad JSON.");
        t.true(error instanceof Error, "Error not instance of Error.");
        resolve();
      }
    );
}));

test("extendSinglePromise", (t) => new Promise((resolve) => {
  t.plan(1);
  const expected = require("./config/config-child.json");
  markdownlint.promises.extendConfig(
    expected, "./test/config/config-child.json"
  )
    .then((actual) => {
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("extendCustomFileSystemPromise", (t) => new Promise((resolve) => {
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
    "MD041": true
  };
  const fsApi = {
    "access": (p, m, cb) => {
      t.is(p, extended);
      return (cb || m)();
    },
    "readFile": (p, o, cb) => {
      switch (p) {
        case extended:
          t.is(p, extended);
          return cb(null, JSON.stringify(extendedContent));
        default:
          return t.fail();
      }
    }
  };
  markdownlint.promises.extendConfig(fileContent, file, undefined, fsApi)
    .then((actual) => {
      t.truthy(fileContent.extends);
      const expected = {
        ...extendedContent,
        ...fileContent
      };
      // @ts-ignore
      delete expected.extends;
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

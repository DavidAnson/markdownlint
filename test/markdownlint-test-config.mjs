// @ts-check

import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import os from "node:os";
import path from "node:path";
import test from "ava";
import { readConfig as readConfigAsync } from "markdownlint/async";
import { extendConfig, readConfig as readConfigPromise } from "markdownlint/promise";
import { readConfig as readConfigSync } from "markdownlint/sync";
import { __dirname } from "./esm-helpers.mjs";

const sameFileSystem = (path.relative(os.homedir(), __dirname(import.meta)) !== __dirname(import.meta));

test("configSingle", (t) => new Promise((resolve) => {
  t.plan(2);
  readConfigAsync("./test/config/config-child.json",
    function callback(err, actual) {
      t.falsy(err);
      const expected = require("./config/config-child.json");
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("configAbsolute", (t) => new Promise((resolve) => {
  t.plan(2);
  readConfigAsync(path.join(__dirname(import.meta), "config", "config-child.json"),
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
    readConfigAsync(
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
  readConfigAsync("./test/config/config-grandparent.json",
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
  readConfigAsync("./test/config/config-packageparent.json",
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
  readConfigAsync(
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
  readConfigAsync("./test/config/config-badfile.json",
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
  readConfigAsync("./test/config/config-badchildfile.json",
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
  readConfigAsync("./test/config/config-badchildpackage.json",
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
  readConfigAsync("./test/config/config-badjson.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad JSON.");
      t.true(err instanceof Error, "Error not instance of Error.");
      t.true(!result, "Got result for bad JSON.");
      resolve();
    });
}));

test("configBadChildJson", (t) => new Promise((resolve) => {
  t.plan(3);
  readConfigAsync("./test/config/config-badchildjson.json",
    function callback(err, result) {
      t.truthy(err, "Did not get an error for bad child JSON.");
      t.true(err instanceof Error, "Error not instance of Error.");
      t.true(!result, "Got result for bad child JSON.");
      resolve();
    });
}));

test("configSingleYaml", (t) => new Promise((resolve) => {
  t.plan(2);
  readConfigAsync(
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
  readConfigAsync(
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
  readConfigAsync(
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
  readConfigAsync(
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
  const actual = readConfigSync("./test/config/config-child.json");
  const expected = require("./config/config-child.json");
  t.deepEqual(actual, expected, "Config object not correct.");
});

test("configAbsoluteSync", (t) => {
  t.plan(1);
  const actual = readConfigSync(
    path.join(__dirname(import.meta), "config", "config-child.json"));
  const expected = require("./config/config-child.json");
  t.deepEqual(actual, expected, "Config object not correct.");
});

if (sameFileSystem) {
  test("configTildeSync", (t) => {
    t.plan(1);
    const actual = readConfigSync(
      `~/${path.relative(os.homedir(), "./test/config/config-child.json")}`);
    const expected = require("./config/config-child.json");
    t.deepEqual(actual, expected, "Config object not correct.");
  });
}

test("configMultipleSync", (t) => {
  t.plan(1);
  const actual =
    readConfigSync("./test/config/config-grandparent.json");
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
      readConfigSync("./test/config/config-badfile.json");
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
      readConfigSync("./test/config/config-badchildfile.json");
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
      readConfigSync("./test/config/config-badjson.json");
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
      readConfigSync("./test/config/config-badchildjson.json");
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
  const actual = readConfigSync(
    // @ts-ignore
    "./test/config/config-child.yaml", [ require("js-yaml").load ]);
  const expected = require("./config/config-child.json");
  t.deepEqual(actual, expected, "Config object not correct.");
});

test("configMultipleYamlSync", (t) => {
  t.plan(1);
  const actual = readConfigSync(
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
  const actual = readConfigSync(
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
  const actual = readConfigSync(file, undefined, fsApi);
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
      readConfigSync(
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
  readConfigPromise("./test/config/config-child.json")
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
  readConfigPromise(file, undefined, fsApi)
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
  readConfigPromise("./test/config/config-badfile.json")
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
  extendConfig(
    expected,
    "./test/config/config-child.json",
    undefined,
    fs
  )
    .then((actual) => {
      t.deepEqual(actual, expected, "Config object not correct.");
      resolve();
    });
}));

test("extendBadPromise", (t) => new Promise((resolve) => {
  t.plan(2);
  extendConfig(
    {
      "extends": "missing.json"
    },
    "./test/config/missing.json",
    undefined,
    fs
  )
    .then(
      null,
      (error) => {
        t.truthy(error, "Did not get an error for bad input.");
        t.true(error instanceof Error, "Error not instance of Error.");
        resolve();
      }
    );
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
  extendConfig(fileContent, file, undefined, fsApi)
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

// @ts-check

import test from "ava";
import path from "node:path";
import { __dirname as getDirname } from "./esm-helpers.mjs";
import { resolveModule, resolveModuleCustomResolve } from "../lib/resolve-module.cjs";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = getDirname(import.meta);

test("built-in module", (t) => {
  t.plan(1);
  t.deepEqual(
    resolveModule("node:fs"),
    require.resolve("node:fs")
  );
});

test("locally-installed module", (t) => {
  t.plan(1);
  t.deepEqual(
    resolveModule("micromark"),
    require.resolve("micromark")
  );
});

test("absolute path to module", (t) => {
  t.plan(1);
  const absolute =
    path.resolve(
      __dirname,
      "./rules/node_modules/markdownlint-rule-sample-commonjs"
    );
  t.deepEqual(
    resolveModule(absolute),
    require.resolve(absolute)
  );
});

test("relative (to __dirname) path to module", (t) => {
  t.plan(1);
  t.deepEqual(
    resolveModule(
      "./rules/node_modules/markdownlint-rule-sample-module",
      // __dirname is needed because require.resolve is relative to this
      // file while resolveModule is relative to resolve-module.cjs
      [ __dirname ]
    ),
    require.resolve(
      "./rules/node_modules/markdownlint-rule-sample-module"
    )
  );
});

test("module in alternate node_modules", (t) => {
  t.plan(3);
  t.throws(
    () => require.resolve("markdownlint-rule-sample-commonjs"),
    { "code": "MODULE_NOT_FOUND" }
  );
  t.throws(
    () => resolveModule("markdownlint-rule-sample-commonjs"),
    { "code": "MODULE_NOT_FOUND" }
  );
  t.deepEqual(
    resolveModule(
      "markdownlint-rule-sample-commonjs",
      [ path.join(__dirname, "rules") ]
    ),
    require.resolve(
      "markdownlint-rule-sample-commonjs",
      { "paths": [ path.join(__dirname, "rules") ] }
    )
  );
});

test("module local, relative, and in alternate node_modules (same paths)", (t) => {
  t.plan(3);
  const paths = [
    __dirname,
    path.join(__dirname, "rules")
  ];
  t.deepEqual(
    resolveModule(
      "micromark",
      paths
    ),
    require.resolve(
      "micromark",
      { paths }
    )
  );
  t.deepEqual(
    resolveModule(
      "./rules/node_modules/markdownlint-rule-sample-commonjs",
      paths
    ),
    require.resolve(
      "./rules/node_modules/markdownlint-rule-sample-commonjs",
      { paths }
    )
  );
  t.deepEqual(
    resolveModule(
      "markdownlint-rule-sample-commonjs",
      paths
    ),
    require.resolve(
      "markdownlint-rule-sample-commonjs",
      { paths }
    )
  );
});

test("custom resolve implementation", (t) => {
  t.plan(1);
  const expected =
    require.resolve("./rules/node_modules/markdownlint-rule-sample-module");
  const customResolve = (id, options) => require.resolve(id, options);
  customResolve.paths = (request) => require.resolve.paths(request);
  t.deepEqual(
    resolveModuleCustomResolve(
      customResolve,
      "./rules/node_modules/markdownlint-rule-sample-module",
      [ __dirname ]
    ),
    expected
  );
});

test("custom resolve implementation, missing paths", (t) => {
  t.plan(1);
  const expected =
    require.resolve("./rules/node_modules/markdownlint-rule-sample-commonjs");
  const customResolve = (id, options) => require.resolve(id, options);
  t.deepEqual(
    resolveModuleCustomResolve(
      // @ts-ignore
      customResolve,
      "./rules/node_modules/markdownlint-rule-sample-commonjs",
      [ __dirname ]
    ),
    expected
  );
});

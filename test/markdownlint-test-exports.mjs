// @ts-check

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import test from "ava";
import spawn from "nano-spawn";
import { importWithTypeJson } from "./esm-helpers.mjs";
const packageJson = await importWithTypeJson(import.meta, "../package.json");

const exportMappings = new Map([
  [ ".", "../lib/exports.mjs" ],
  [ "./async", "../lib/exports-async.mjs" ],
  [ "./promise", "../lib/exports-promise.mjs" ],
  [ "./sync", "../lib/exports-sync.mjs" ],
  [ "./helpers", "../helpers/helpers.cjs" ],
  [ "./style/all", "../style/all.json" ],
  [ "./style/cirosantilli", "../style/cirosantilli.json" ],
  [ "./style/prettier", "../style/prettier.json" ],
  [ "./style/relaxed", "../style/relaxed.json" ]
]);

test("exportMappings table", (t) => {
  t.deepEqual(
    Object.keys(packageJson.exports),
    [ ...exportMappings.keys() ]
  );
});

const jsonRe = /\.json$/u;
// ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
// const importOptionsJson = { "with": { "type": "json" } };

for (const [ exportName, exportPath ] of exportMappings) {
  const exportByName = exportName.replace(/^\./u, packageJson.name);
  test(`export mapping for ${exportByName}`, async(t) => {
    t.plan(1);
    const json = jsonRe.test(exportPath);
    const importExportByName = json ?
      require(exportByName) :
      await import(exportByName);
    const importExportByPath = json ?
      require(exportPath) :
      await import(exportPath);
    t.is(importExportByName, importExportByPath);
  });
}

test(`exported names`, async(t) => {
  t.plan(1);
  const exportedNames = {};
  for (const [ exportName, exportPath ] of exportMappings) {
    const exportByName = exportName.replace(/^\./u, packageJson.name);
    const json = jsonRe.test(exportPath);
    const importExportByName = json ?
      require(exportByName) :
      // eslint-disable-next-line no-await-in-loop
      await import(exportByName);
    // Filter out module.exports to keep snapshot consistent between Node 22 (missing) and 23 (present)
    exportedNames[exportByName] = Object.keys(importExportByName).filter((name) => name !== "module.exports");
  }
  t.snapshot(exportedNames);
});

test("subpathImports and conditions", async(t) => {
  t.plan(8);
  const scenarios = [
    { "conditions": "browser", "throws": true },
    { "conditions": "default", "throws": false },
    { "conditions": "markdownlint-imports-browser", "throws": true },
    { "conditions": "markdownlint-imports-node", "throws": false }
  ];
  for (const scenario of scenarios) {
    const { conditions, throws } = scenario;
    try {
      // eslint-disable-next-line no-await-in-loop
      await spawn("node", [ `--conditions=${conditions}`, "./standalone.mjs" ], { "cwd": "./example" });
      t.true(!throws, conditions);
    } catch {
      t.true(throws, conditions);
    }
  }
  // Fake "100%" coverage for node-imports-browser.mjs
  const { "fs": browserFs } = await import("../lib/node-imports-browser.mjs");
  t.throws(() => browserFs.access());
  t.throws(() => browserFs.accessSync());
  t.throws(() => browserFs.readFile());
  t.throws(() => browserFs.readFileSync());
});

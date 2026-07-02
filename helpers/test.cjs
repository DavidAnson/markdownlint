// @ts-check

"use strict";

const test = require("node:test");
const { "exports": packageExports, name } = require("../helpers/package.json");

const exportMappings = new Map([
  [ ".", "../helpers/helpers.cjs" ],
  [ "./micromark", "../helpers/micromark-helpers.cjs" ]
]);

test.suite(__filename.replace(/^.*?\/(?<name>[^/]*\/[^/]*)$/u, "$<name>"), () => {

  test("exportMappings", (t) => {
    t.assert.deepEqual(
      Object.keys(packageExports),
      [ ...exportMappings.keys() ]
    );
  });

  for (const [ exportName, exportPath ] of exportMappings) {
    test(exportName, (t) => {
      t.assert.equal(
        require(exportName.replace(/^\./u, () => name)),
        require(exportPath)
      );
    });
  }

});

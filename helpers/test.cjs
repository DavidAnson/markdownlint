// @ts-check

"use strict";

// eslint-disable-next-line n/no-extraneous-require
const test = require("ava").default;
const { "exports": packageExports, name } = require("../helpers/package.json");

const exportMappings = new Map([
  [ ".", "../helpers/helpers.js" ],
  [ "./micromark", "../helpers/micromark-helpers.cjs" ]
]);

test("exportMappings", (t) => {
  t.deepEqual(
    Object.keys(packageExports),
    [ ...exportMappings.keys() ]
  );
});

for (const [ exportName, exportPath ] of exportMappings) {
  test(exportName, (t) => {
    t.is(
      require(exportName.replace(/^\./u, name)),
      require(exportPath)
    );
  });
}

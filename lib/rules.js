// @ts-check

"use strict";

const { homepage, version } = require("./constants");

const rules = [
  require("./md001"),
  require("./md002"),
  require("./md003"),
  require("./md004"),
  require("./md005"),
  require("./md006"),
  require("./md007"),
  require("./md009"),
  require("./md010"),
  require("./md011"),
  require("./md012"),
  require("./md013"),
  require("./md014"),
  require("./md018"),
  require("./md019"),
  require("./md020"),
  require("./md021"),
  require("./md022"),
  require("./md023"),
  require("./md024"),
  require("./md025"),
  require("./md026"),
  require("./md027"),
  require("./md028"),
  require("./md029"),
  require("./md030"),
  require("./md031"),
  require("./md032"),
  require("./md033"),
  require("./md034"),
  require("./md035"),
  require("./md036"),
  require("./md037"),
  require("./md038"),
  require("./md039"),
  require("./md040"),
  require("./md041"),
  require("./md042"),
  require("./md043"),
  require("./md044"),
  require("./md045"),
  require("./md046"),
  require("./md047"),
  require("./md048"),
  ...require("./md049-md050"),
  require("./md051"),
  require("./md052"),
  require("./md053")
];
for (const rule of rules) {
  const name = rule.names[0].toLowerCase();
  // eslint-disable-next-line dot-notation
  rule["information"] =
    new URL(`${homepage}/blob/v${version}/doc/Rules.md#${name}`);
}
module.exports = rules;

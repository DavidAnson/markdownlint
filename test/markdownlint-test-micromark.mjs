// @ts-check

import fs from "node:fs/promises";
import test from "ava";
import { newLineRe } from "../helpers/helpers.js";
import { filterByPredicate, filterByTypes, getMicromarkEvents, parse }
  from "../helpers/micromark.cjs";

const testContent = new Promise((resolve, reject) => {
  fs
    .readFile("./test/every-markdown-syntax.md", "utf8")
    .then((content) => content.split(newLineRe).join("\n"))
    .then(resolve, reject);
});

const testTokens = new Promise((resolve, reject) => {
  testContent.then(parse).then(resolve, reject);
});

test("parse", async(t) => {
  t.plan(1);
  t.snapshot(await testTokens, "Unexpected tokens");
});

test("getMicromarkEvents/filterByPredicate", async(t) => {
  t.plan(1);
  const content = await testContent;
  const events = getMicromarkEvents(content);
  const eventTypes = events
    .filter((event) => event[0] === "enter")
    .map((event) => event[1].type);
  const tokens = parse(content);
  const filtered = filterByPredicate(tokens, () => true);
  const tokenTypes = filtered.map((token) => token.type);
  t.deepEqual(tokenTypes, eventTypes);
});

test("filterByTypes", async(t) => {
  t.plan(6);
  const filtered = filterByTypes(
    await testTokens,
    [ "atxHeadingText", "codeText", "htmlText", "setextHeadingText" ]
  );
  for (const token of filtered) {
    t.true(token.type.endsWith("Text"));
  }
});

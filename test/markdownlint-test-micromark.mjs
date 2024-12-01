// @ts-check

import fs from "node:fs/promises";
import test from "ava";
import { newLineRe } from "../helpers/helpers.cjs";
import { filterByPredicate, filterByTypes } from "../helpers/micromark-helpers.cjs";
import { getEvents, parse } from "../lib/micromark-parse.mjs";

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

test("getEvents/filterByPredicate", async(t) => {
  t.plan(1);
  const content = await testContent;
  const events = getEvents(content);
  let inHtmlFlow = false;
  const eventTypes = events
    .filter((event) => {
      const result = !inHtmlFlow && (event[0] === "enter");
      if (event[1].type === "htmlFlow") {
        inHtmlFlow = !inHtmlFlow;
      }
      return result;
    })
    .map((event) => event[1].type);
  const tokens = parse(content);
  const filtered = filterByPredicate(
    tokens,
    () => true,
    (token) => ((token.type === "htmlFlow") ? [] : token.children)
  );
  const tokenTypes = filtered.map((token) => token.type);
  t.deepEqual(tokenTypes, eventTypes);
});

test("filterByTypes, htmlFlow false", async(t) => {
  t.plan(7);
  const tokens = await testTokens;
  /** @type {import("micromark-util-types").TokenType[]} */
  const types = [ "atxHeadingText", "codeText", "htmlText", "setextHeadingText" ];
  const filtered = filterByTypes(tokens, types);
  // Using flat tokens
  for (const token of filtered) {
    t.true(token.type.endsWith("Text"));
  }
  // Not using flat tokens
  t.deepEqual(
    filtered,
    filterByTypes([ ...tokens ], types)
  );
});

test("filterByTypes, htmlFlow true", async(t) => {
  t.plan(9);
  const tokens = await testTokens;
  /** @type {import("micromark-util-types").TokenType[]} */
  const types = [ "atxHeadingText", "codeText", "htmlText", "setextHeadingText" ];
  // Using flat tokens
  const filtered = filterByTypes(tokens, types, true);
  for (const token of filtered) {
    t.true(token.type.endsWith("Text"));
  }
  // Not using flat tokens
  t.deepEqual(
    filtered,
    filterByTypes([ ...tokens ], types, true)
  );
});

test("filterByPredicate/filterByTypes", async(t) => {
  t.plan(1);
  const tokens = await testTokens;
  const byPredicate = filterByPredicate(tokens, () => true);
  const allTypes = new Set(byPredicate.map((token) => token.type));
  const byTypes = filterByTypes(tokens, [ ...allTypes.values() ], true);
  t.deepEqual(byPredicate, byTypes);
});

// @ts-check

import fs from "node:fs/promises";
import test from "node:test";
import stringifySafe from "json-stringify-safe";
import { newlineRe } from "../helpers/shared.cjs";
import { filterByPredicate, filterByTypes } from "../helpers/micromark-helpers.cjs";
import { getEvents, parse } from "../lib/micromark-parse.mjs";

const normalize = (/** @type {string} */ content) => content.split(newlineRe).join("\n");

const testContent = new Promise((resolve, reject) => {
  fs
    .readFile("./test/every-markdown-syntax.md", "utf8")
    .then(normalize)
    .then(resolve, reject);
});

const testTokens = new Promise((resolve, reject) => {
  testContent.then(parse).then(resolve, reject);
});

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  test("parse", async(t) => {
    t.plan(1);
    t.assert.snapshot(stringifySafe(await testTokens));
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
    t.assert.deepEqual(tokenTypes, eventTypes);
  });

  test("filterByTypes, htmlFlow false", async(t) => {
    t.plan(7);
    const tokens = await testTokens;
    /** @type {import("micromark-util-types").TokenType[]} */
    const types = [ "atxHeadingText", "codeText", "htmlText", "setextHeadingText" ];
    const filtered = filterByTypes(tokens, types);
    // Using flat tokens
    for (const token of filtered) {
      t.assert.equal(token.type.endsWith("Text"), true);
    }
    // Not using flat tokens
    t.assert.deepEqual(
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
      t.assert.equal(token.type.endsWith("Text"), true);
    }
    // Not using flat tokens
    t.assert.deepEqual(
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
    t.assert.deepEqual(byPredicate, byTypes);
  });

  test("micromark directive extension syntax", async(t) => {
    t.plan(1);
    const tokens = parse(normalize(await fs.readFile("./test/micromark-directive-extension-syntax.md", "utf8")));
    t.assert.snapshot(stringifySafe(tokens));
  });

});

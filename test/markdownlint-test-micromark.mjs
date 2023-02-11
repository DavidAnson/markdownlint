// @ts-check

import fs from "node:fs/promises";
import test from "ava";
import { newLineRe } from "../helpers/helpers.js";
import { filterByPredicate, filterByTypes, getMicromarkEvents, parse }
  from "../helpers/micromark.cjs";

test("parse", async(t) => {
  t.plan(1);
  const content = await fs.readFile("./test/every-markdown-syntax.md", "utf8");
  const normalizedContent = content.split(newLineRe).join("\n");
  const document = parse(normalizedContent);
  t.snapshot(document, "Unexpected tokens");
});

test("getMicromarkEvents/filterByPredicate", async(t) => {
  t.plan(1);
  const content = await fs.readFile("./test/every-markdown-syntax.md", "utf8");
  const normalizedContent = content.split(newLineRe).join("\n");
  const events = getMicromarkEvents(normalizedContent);
  const eventTypes = events
    .filter((event) => event[0] === "enter")
    .map((event) => event[1].type);
  const document = parse(normalizedContent);
  const tokens = filterByPredicate(document, () => true);
  const tokenTypes = tokens.map((token) => token.type);
  t.deepEqual(tokenTypes, eventTypes);
});

test("filterByTypes", async(t) => {
  t.plan(6);
  const content = await fs.readFile("./test/every-markdown-syntax.md", "utf8");
  const normalizedContent = content.split(newLineRe).join("\n");
  const document = parse(normalizedContent);
  const tokens = filterByTypes(
    document,
    [ "atxHeadingText", "codeText", "htmlText", "setextHeadingText" ]
  );
  for (const token of tokens) {
    t.true(token.type.endsWith("Text"));
  }
});

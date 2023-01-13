// @ts-check

import fs from "node:fs/promises";
import test from "ava";
import { newLineRe } from "../helpers/helpers.js";
import { parse } from "../lib/micromark.mjs";

test("parse", async(t) => {
  t.plan(1);
  const content = await fs.readFile("./test/every-markdown-syntax.md", "utf8");
  const document = parse(content.split(newLineRe).join("\n"));
  t.snapshot(document, "Unexpected tokens");
});

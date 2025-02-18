import { readFile, writeFile } from "node:fs/promises";
import { EOL } from "node:os";
import rules from "../lib/rules.mjs";
import { newLineRe } from "../helpers/helpers.cjs";
import { deprecatedRuleNames, fixableRuleNames } from "../lib/constants.mjs";

const maxLineLength = 80;

const pathFor = (relativePath) => new URL(relativePath, import.meta.url);
const inCode = (items) => items.map((item) => `\`${item}\``);
const sortedComma = (items) => items.sort().join(", ");
const linesFrom = (text) => text.split(newLineRe);
const wrapListItem = (line) => {
  const wrappedLines = [];
  let remainingLine = line;
  while (remainingLine.length > maxLineLength) {
    let index = maxLineLength - 1;
    while (remainingLine[index] !== " ") {
      index--;
    }
    wrappedLines.push(remainingLine.slice(0, index + 1).trimEnd());
    remainingLine = "  " + remainingLine.slice(index + 1).trimStart();
  }
  wrappedLines.push(remainingLine);
  return wrappedLines;
};

// import { default as schema } from "file.json" assert { type: "json" };
const importJson =
  async(file) => JSON.parse(await readFile(pathFor(file)));
const schema = await importJson("../schema/markdownlint-config-schema.json");

const lines = [];

const heading = await readFile(pathFor("./heading.md"), "utf8");
lines.push(...linesFrom(heading));

for (const rule of rules) {
  const name = rule.names[0];
  const deprecated = deprecatedRuleNames.includes(name);
  const decorator = deprecated ? "~~" : "";
  lines.push(
    `<a name="${name.toLowerCase()}"></a>`,
    ""
  );
  const section = [];
  section.push(
    `## ${decorator}\`${name}\` - ${rule.description}${decorator}`,
    ""
  );
  if (deprecated) {
    section.push(
      "> This rule is deprecated and provided for backward-compatibility",
      ""
    );
  }
  section.push(
    `Tags: ${sortedComma(inCode(rule.tags))}`,
    "",
    `Aliases: ${sortedComma(inCode(rule.names.slice(1)))}`,
    ""
  );
  const ruleData = schema.properties[name];
  if (ruleData.properties) {
    section.push(
      "Parameters:",
      ""
    );
    for (const property of Object.keys(ruleData.properties).sort()) {
      const propData = ruleData.properties[property];
      const propType = [ propData.type ]
        .flat()
        .map((type) => ((type === "array") ? `${propData.items.type}[]` : type))
        .join("|");
      const defaultValue = Array.isArray(propData.default) ?
        JSON.stringify(propData.default) :
        propData.default;
      const allValues = propData.enum?.sort();
      const listItem = `- \`${property}\`: ${propData.description} (` +
        `\`${propType}\`, default \`${defaultValue}\`` +
        (propData.enum ?
          `, values ${allValues.map((value) => `\`${value}\``).join(" / ")}` :
          ""
        ) +
        ")";
      section.push(...wrapListItem(listItem));
    }
    section.push(
      ""
    );
  }
  if (fixableRuleNames.includes(name)) {
    section.push(
      "Fixable: Some violations can be fixed by tooling",
      ""
    );
  }
  const contents =
    // eslint-disable-next-line no-await-in-loop
    await readFile(pathFor(`./${name.toLowerCase()}.md`), "utf8");
  section.push(...linesFrom(contents));

  // eslint-disable-next-line no-await-in-loop
  await writeFile(
    pathFor(`../doc/${name.toLowerCase()}.md`),
    section.join(EOL).slice(1),
    "utf8"
  );

  lines.push(...section);
}

const footing = await readFile(pathFor("./footing.md"), "utf8");
lines.push(...linesFrom(footing));

const content = lines.join(EOL);
await writeFile(pathFor("../doc/Rules.md"), content, "utf8");

// @ts-check

const titleRe = /^\s*title:\s(.*)$/u;

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "capitalize-front-matter-title" ],
  "description": "Rule that capitalizes the title property in YAML front matter",
  "tags": [ "test", "front matter", "yaml" ],
  "parser": "none",
  "function": (params, onError) => {
    const { frontMatterLines } = params;
    for (const [ lineIndex, frontMatterLine ] of frontMatterLines.entries()) {
      const match = titleRe.exec(frontMatterLine);
      if (match) {
        const [ line, title ] = match;
        const column = match.index + (line.length - title.length) + 1;
        const length = title.length;
        onError({
          "frontMatter": true,
          "lineNumber": lineIndex + 1,
          "range": [ column, length ],
          "fixInfo": {
            "editColumn": column,
            "deleteCount": length,
            "insertText": title.trim().toUpperCase()
          }
        });
      }
    }
  }
};

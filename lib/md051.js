// @ts-check

"use strict";

const { addError, addErrorDetailIf } = require("../helpers");
const { filterByHtmlTokens, filterByTypes, getHtmlTagInfo } =
  require("../helpers/micromark.cjs");

// Regular expression for identifying HTML anchor names
const idRe = /\sid\s*=\s*['"]?([^'"\s>]+)/iu;
const nameRe = /\sname\s*=\s*['"]?([^'"\s>]+)/iu;
const anchorRe = /\{(#[a-z\d]+(?:[-_][a-z\d]+)*)\}/gu;

/**
 * Converts a Markdown heading into an HTML fragment according to the rules
 * used by GitHub.
 *
 * @param {Object} headingText Heading text token.
 * @returns {string} Fragment string for heading.
 */
function convertHeadingToHTMLFragment(headingText) {
  const inlineText =
    filterByTypes(headingText.children, [ "codeTextData", "data" ])
      .map((token) => token.text)
      .join("");
  return "#" + encodeURIComponent(
    inlineText
      .toLowerCase()
      // RegExp source with Ruby's \p{Word} expanded into its General Categories
      // eslint-disable-next-line max-len
      // https://github.com/gjtorikian/html-pipeline/blob/main/lib/html/pipeline/toc_filter.rb
      // https://ruby-doc.org/core-3.0.2/Regexp.html
      .replace(
        /[^\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation}\- ]/gu,
        ""
      )
      .replace(/ /gu, "-")
  );
}

module.exports = {
  "names": [ "MD051", "link-fragments" ],
  "description": "Link fragments should be valid",
  "tags": [ "links" ],
  "function": function MD051(params, onError) {
    const { tokens } = params.parsers.micromark;
    const fragments = new Map();

    // Process headings
    const headingTexts = filterByTypes(
      tokens,
      [ "atxHeadingText", "setextHeadingText" ]
    );
    for (const headingText of headingTexts) {
      const fragment = convertHeadingToHTMLFragment(headingText);
      const count = fragments.get(fragment) || 0;
      if (count) {
        fragments.set(`${fragment}-${count}`, 0);
      }
      fragments.set(fragment, count + 1);
      let match = null;
      while ((match = anchorRe.exec(headingText.text)) !== null) {
        const [ , anchor ] = match;
        if (!fragments.has(anchor)) {
          fragments.set(anchor, 1);
        }
      }
    }

    // Process HTML anchors
    for (const token of filterByHtmlTokens(tokens)) {
      const htmlTagInfo = getHtmlTagInfo(token);
      if (htmlTagInfo && !htmlTagInfo.close) {
        const anchorMatch = idRe.exec(token.text) ||
          (htmlTagInfo.name.toLowerCase() === "a" && nameRe.exec(token.text));
        if (anchorMatch) {
          fragments.set(`#${anchorMatch[1]}`, 0);
        }
      }
    }

    // Process link and definition fragments
    const parentChilds = [
      [ "link", "resourceDestinationString" ],
      [ "definition", "definitionDestinationString" ]
    ];
    for (const [ parentType, definitionType ] of parentChilds) {
      const links = filterByTypes(tokens, [ parentType ]);
      for (const link of links) {
        const definitions = filterByTypes(link.children, [ definitionType ]);
        for (const definition of definitions) {
          if (
            (definition.text.length > 1) &&
            definition.text.startsWith("#") &&
            !fragments.has(definition.text)
          ) {
            // eslint-disable-next-line no-undef-init
            let context = undefined;
            // eslint-disable-next-line no-undef-init
            let range = undefined;
            // eslint-disable-next-line no-undef-init
            let fixInfo = undefined;
            if (link.startLine === link.endLine) {
              context = link.text;
              range = [ link.startColumn, link.endColumn - link.startColumn ];
              fixInfo = {
                "editColumn": definition.startColumn,
                "deleteCount": definition.endColumn - definition.startColumn
              };
            }
            const definitionTextLower = definition.text.toLowerCase();
            const mixedCaseKey = [ ...fragments.keys() ]
              .find((key) => definitionTextLower === key.toLowerCase());
            if (mixedCaseKey) {
              // @ts-ignore
              (fixInfo || {}).insertText = mixedCaseKey;
              addErrorDetailIf(
                onError,
                link.startLine,
                mixedCaseKey,
                definition.text,
                undefined,
                context,
                range,
                fixInfo
              );
            } else {
              addError(
                onError,
                link.startLine,
                undefined,
                context,
                range
              );
            }
          }
        }
      }
    }
  }
};

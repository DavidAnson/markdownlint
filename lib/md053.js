// @ts-check

"use strict";

const { addError, ellipsify, linkReferenceDefinitionRe } =
  require("../helpers");
const { referenceLinkImageData } = require("./cache");

module.exports = {
  "names": [ "MD053", "link-image-reference-definitions" ],
  "description": "Link and image reference definitions should be needed",
  "tags": [ "images", "links" ],
  "function": function MD053(params, onError) {
    const { lines } = params;
    const { references, shortcuts, definitions, duplicateDefinitions } =
      referenceLinkImageData();
    const singleLineDefinition = (line) => (
      line.replace(linkReferenceDefinitionRe, "").trim().length > 0
    );
    const deleteFixInfo = {
      "deleteCount": -1
    };
    // Look for unused link references (unreferenced by any link/image)
    for (const definition of definitions.entries()) {
      const [ label, lineIndex ] = definition;
      if (!references.has(label) && !shortcuts.has(label)) {
        const line = lines[lineIndex];
        addError(
          onError,
          lineIndex + 1,
          `Unused link or image reference definition: "${label}"`,
          ellipsify(line),
          [ 1, line.length ],
          singleLineDefinition(line) ? deleteFixInfo : 0
        );
      }
    }
    // Look for duplicate link references (defined more than once)
    for (const duplicateDefinition of duplicateDefinitions) {
      const [ label, lineIndex ] = duplicateDefinition;
      const line = lines[lineIndex];
      addError(
        onError,
        lineIndex + 1,
        `Duplicate link or image reference definition: "${label}"`,
        ellipsify(line),
        [ 1, line.length ],
        singleLineDefinition(line) ? deleteFixInfo : 0
      );
    }
  }
};

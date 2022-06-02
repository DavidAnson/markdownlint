// @ts-check

"use strict";

const { addError } = require("../helpers");
const { referenceLinkImageData } = require("./cache");

module.exports = {
  "names": [ "MD052", "reference-links-images" ],
  "description":
    "Reference links and images should use a label that is defined",
  "tags": [ "images", "links" ],
  "function": function MD052(params, onError) {
    const { lines } = params;
    const { references, definitions } = referenceLinkImageData();
    // Look for links/images that use an undefined link reference
    for (const reference of references.entries()) {
      const [ label, datas ] = reference;
      if (!definitions.has(label)) {
        for (const data of datas) {
          const [ lineIndex, index, length ] = data;
          // Context will be incomplete if reporting for a multi-line link
          const context = lines[lineIndex].slice(index, index + length);
          addError(
            onError,
            lineIndex + 1,
            `Missing link or image reference definition: "${label}"`,
            context,
            [ index + 1, context.length ]
          );
        }
      }
    }
  }
};

// @ts-check

"use strict";

const shared = require("./shared");

const isAlphabetCharacter = (char) => {
  const charCode = char.charCodeAt(0);

  return charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0);
};

module.exports = {
  "names": [ "MD046", "sentences-per-line" ],
  "description": "Each sentence should be on its own line",
  "tags": [ "sentences" ],
  "function": function MD046(params, onError) {
    let inFence = false;
    shared.forEachLine(function forLine(line, lineIndex) {
      if (line.substring(0, 3) === "```") {
        inFence = !inFence;
        return;
      }

      if (inFence) {
        return;
      }

      for (let i = 0; i < line.length - 2; i += 1) {
        if (line[i] === "`" && (i === 0 || line[i - 1] === "\\")) {
          i = line.indexOf("`", i);
        }

        if (line[i] === "." && line[i + 1] === " " && isAlphabetCharacter(line[i + 2])) {
          shared.addError(onError, lineIndex, null, line.substr(i, 2));
        }
      }
    });
  }
};

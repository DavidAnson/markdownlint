// @ts-check

"use strict";

const {
  forEachLine,
  getLineMetadata,
  addError
} = require("../helpers");

const getNextIndexNotInCode = (line, i) => {
  if (line[i] !== "`") {
    return i;
  }

  i += 1;

  // Get to the inside of this inline code segment
  while (line[i] === "`") {
    i += 1;

    if (i === line.length) {
      return -1;
    }
  }

  // Get to the end of the inline code segment
  // eslint-disable-next-line no-constant-condition
  while (true) {
    i = line.indexOf("`", i);

    if (i === -1) {
      return -1;
    }

    if (line[i - 1] !== "\\") {
      break;
    }
  }

  while (line[i] === "`") {
    i += 1;

    if (i === line.length) {
      return -1;
    }
  }

  return i;
};

const isAfterIgnoredWord = (ignoredWords, line, i) => {
  for (const ignoredWord of ignoredWords) {
    const lastWordInLine = line.substring(i - ignoredWord.length, i);
    if (ignoredWord === lastWordInLine.toLowerCase()) {
      return true;
    }
  }

  return false;
};

module.exports = {
  "names": [ "MD054", "sentences-per-line" ],
  "description": "Each sentence should be on its own line",
  "tags": [ "sentences" ],
  "function": (params, onError) => {

    const ignoredWords = params.config.ignored_words || [];
    const lineEndings = params.config.line_endings || [ "." ];
    const sentenceStartRegex = params.config.sentence_start ||
      "^(\\s+)(\\w|[*_'\"])";
    const contextSize = Number(params.config.context_length || 14);

    const sentenceStart = new RegExp(sentenceStartRegex);

    forEachLine(
      getLineMetadata(params),
      (line, lineIndex) => {
        let i = 0;
        // Ignore headings
        if (/^\s*#/.test(line)) {
          return;
        }

        // Ignore any starting list number, e.g. "1. " or " 1. "
        if (/^\s*\d+\./.test(line)) {
          i = line.indexOf(".") + 1;
        }

        for (; i < line.length - 2; i += 1) {
          i = getNextIndexNotInCode(line, i);
          if (i === -1 || i >= line.length - 2) {
            return;
          }


          if (lineEndings.includes(line[i])) {
            // looking ahead, so we cover more than just one space
            const sentence = sentenceStart.exec(line.substr(i + 1));
            if (
              sentence !== null &&
              !isAfterIgnoredWord(ignoredWords, line, i)
            ) {
              const spaces = sentence[1];
              addError(
                onError,
                lineIndex + 1,
                null,
                line.substr(Math.max(0, i - (contextSize / 2)), contextSize),
                [ i, spaces.length ],
                {
                  "lineNumber": lineIndex + 1,
                  "editColumn": i + 2,
                  "deleteCount": spaces.length,
                  "insertText": "\n"
                }
              );
            }
          }
        }
      }
    );
  }
};
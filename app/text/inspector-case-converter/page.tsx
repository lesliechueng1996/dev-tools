'use client';

import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import {
  camelCase,
  constantCase,
  headerCase,
  paramCase,
  pascalCase,
  snakeCase,
} from 'change-case';
import { useState, MouseEvent, useEffect, KeyboardEvent } from 'react';

type SelectionType = {
  line: number;
  column: number;
  position: number;
};

type StatisticsType = {
  characters: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  bytes: number;
};

type KeyValueType = {
  key: string;
  value: number;
};

const isWord = (char: string) => {
  return /[\p{L}\p{Mn}\p{Nd}]+/gu.test(char);
};

const isSpanEmptyOrNotLetterAndDigit = (
  text: string,
  start: number,
  end: number
): boolean => {
  if (start < 0 || end > text.length) {
    throw new RangeError();
  }
  for (let i = start; i < end; i++) {
    const currentChar = text[i];
    if (isWord(currentChar)) {
      return false;
    }
  }
  return true;
};

const defaultStatistics: StatisticsType = {
  characters: 0,
  words: 0,
  lines: 1,
  sentences: 0,
  paragraphs: 1,
  bytes: 0,
};
const defaultSelection: SelectionType = {
  line: 1,
  column: 0,
  position: 0,
};

function InspectorCaseConverter() {
  const [textCase, setTextCase] = useState('originalText');
  const [inputString, setInputString] = useState('');
  const [backupString, setBackupString] = useState('');
  const [wordFrequency, setWordFrequency] = useState<KeyValueType[]>([]);
  const [characterFrequency, setCharacterFrequency] = useState<KeyValueType[]>(
    []
  );

  const [selection, setSelection] = useState<SelectionType>(defaultSelection);
  const [statistics, setStatistics] =
    useState<StatisticsType>(defaultStatistics);

  // original text handler
  const originalTextHandler = () => {
    setInputString(backupString);
  };

  // sentence case handler
  const sentenceCaseHandler = () => {
    const copy = backupString.slice();
    if (!copy) {
      return;
    }
    let newSentence = true;
    let result = [];
    for (let i = 0; i < copy.length; i++) {
      result.push(copy[i]);
      const currentChar = copy[i];
      if (currentChar === '.' || currentChar === '?' || currentChar === '\n') {
        newSentence = true;
        continue;
      }

      if (isWord(currentChar)) {
        if (newSentence) {
          result[i] = currentChar.toUpperCase();
          newSentence = false;
        } else {
          result[i] = currentChar.toLowerCase();
        }
      }
    }
    setInputString(result.join(''));
  };

  // lower case handler
  const lowerCaseHandler = () => {
    setInputString(backupString.toLowerCase());
  };

  // upper case handler
  const upperCaseHandler = () => {
    setInputString(backupString.toUpperCase());
  };

  // title case handler
  const titleCaseHandler = () => {
    const copy = backupString.slice();
    if (!copy) {
      return;
    }
    let result = [];
    for (let i = 0; i < copy.length; i++) {
      if (i == 0 || !isWord(copy[i - 1])) {
        result[i] = copy[i].toUpperCase();
      } else {
        result[i] = copy[i].toLowerCase();
      }
    }
    setInputString(result.join(''));
  };

  // camel case handler
  const camelCaseHandler = () => {
    setInputString(camelCase(backupString.slice()));
  };

  // pascal case handler
  const pascalCaseHandler = () => {
    setInputString(pascalCase(backupString.slice()));
  };

  // snake case handler
  const snakeCaseHandler = () => {
    setInputString(snakeCase(backupString.slice()));
  };

  // constant case handler
  const constantCaseHandler = () => {
    setInputString(constantCase(backupString.slice()));
  };

  // kebab case handler
  const kebabCaseHandler = () => {
    setInputString(paramCase(backupString.slice()));
  };

  // cobol case handler
  const cobolCaseHandler = () => {
    setInputString(paramCase(backupString.slice()).toUpperCase());
  };

  // train case handler
  const trainCaseHandler = () => {
    setInputString(headerCase(backupString.slice()));
  };

  // alternative case handler
  const alternativeCaseHandler = () => {
    const copy = backupString.slice();
    if (!copy) {
      return;
    }
    let lowerCase = true;
    let result = [];
    for (let i = 0; i < copy.length; i++) {
      if (lowerCase) {
        result.push(copy[i].toLowerCase());
      } else {
        result.push(copy[i].toUpperCase());
      }
      lowerCase = !lowerCase;
    }
    setInputString(result.join(''));
  };

  // inverse case handler
  const inverseCaseHandler = () => {
    const copy = backupString.slice();
    if (!copy) {
      return;
    }
    let lowerCase = false;
    let result = [];
    for (let i = 0; i < copy.length; i++) {
      if (lowerCase) {
        result.push(copy[i].toLowerCase());
      } else {
        result.push(copy[i].toUpperCase());
      }
      lowerCase = !lowerCase;
    }
    setInputString(result.join(''));
  };

  const handleBtnClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLButtonElement;
    const caseType = target.dataset.caseType;
    if (!caseType) {
      return;
    }
    setTextCase(caseType);

    switch (caseType) {
      case 'originalText':
        originalTextHandler();
        break;
      case 'sentenceCase':
        sentenceCaseHandler();
        break;
      case 'lowerCase':
        lowerCaseHandler();
        break;
      case 'upperCase':
        upperCaseHandler();
        break;
      case 'titleCase':
        titleCaseHandler();
        break;
      case 'camelCase':
        camelCaseHandler();
        break;
      case 'pascalCase':
        pascalCaseHandler();
        break;
      case 'snakeCase':
        snakeCaseHandler();
        break;
      case 'constantCase':
        constantCaseHandler();
        break;
      case 'kebabCase':
        kebabCaseHandler();
        break;
      case 'cobolCase':
        cobolCaseHandler();
        break;
      case 'trainCase':
        trainCaseHandler();
        break;
      case 'alternatingCase':
        alternativeCaseHandler();
        break;
      case 'inverseCase':
        inverseCaseHandler();
        break;
      default:
        break;
    }
  };

  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(inputString);
    }
  };

  useEffect(() => {
    if (inputString) {
      const characters = inputString.length;

      const bytes = new TextEncoder().encode(inputString).length;

      let wf = new Map<string, number>();
      const wordRegex = /[\p{L}\p{Mn}\p{Nd}]+/gu;
      const matches = inputString.match(wordRegex);
      const words = matches?.filter((item) => item.length > 0).length || 0;
      matches?.forEach((item) => {
        const count = wf.get(item) || 0;
        wf.set(item, count + 1);
      });
      let tempArray: [string, number][] = [];
      wf.forEach((value, key) => {
        tempArray.push([key, value]);
      });

      setWordFrequency(
        tempArray
          .sort(([key1], [key2]) => key1.localeCompare(key2))
          .map(([key, value]) => {
            return {
              key,
              value,
            };
          })
      );

      const paragraphRegex =
        /[^\r\n]*[^ \r\n]+[^\r\n]*((\r|\n|\r\n)[^\r\n]*[^ \r\n]+[^\r\n]*)*/g;
      const paragraphs =
        inputString.match(paragraphRegex)?.filter((item) => item.length > 0)
          .length || 0;

      let cf = new Map<string, number>();
      let lines = 1;
      let sentences = 0;
      let sentenceBeginningPosition = 0;
      for (let i = 0; i < inputString.length; i++) {
        const currentChar = inputString[i];

        if (
          currentChar === '.' ||
          currentChar === '?' ||
          currentChar === '\n'
        ) {
          if (
            !isSpanEmptyOrNotLetterAndDigit(
              inputString,
              sentenceBeginningPosition,
              i
            )
          ) {
            sentences++;
            sentenceBeginningPosition = i + 1;
          }
        }

        if (currentChar === '\n') {
          lines++;
          continue;
        }

        let temp = currentChar;
        if (currentChar === ' ') {
          temp = '⎵';
        }

        const count = cf.get(temp) || 0;
        cf.set(temp, count + 1);
      }

      if (
        sentenceBeginningPosition < inputString.length - 1 &&
        !isSpanEmptyOrNotLetterAndDigit(
          inputString,
          sentenceBeginningPosition,
          inputString.length
        )
      ) {
        sentences++;
      }

      tempArray = [];
      cf.forEach((value, key) => {
        tempArray.push([key, value]);
      });
      setCharacterFrequency(
        tempArray
          .sort(([key1], [key2]) => key1.localeCompare(key2))
          .map(([key, value]) => {
            return {
              key,
              value,
            };
          })
      );

      setStatistics({
        characters,
        bytes,
        words,
        paragraphs,
        sentences,
        lines,
      });

      // setSelection({
      //   line: lines,
      //   column: inputString.split('\n').pop()?.length || 0,
      //   position: characters,
      // });
    } else {
      setStatistics(defaultStatistics);
      setCharacterFrequency([]);
      setWordFrequency([]);
      setSelection(defaultSelection);
    }
  }, [inputString]);

  const handleSelectionChange = (
    e:
      | MouseEvent<HTMLTextAreaElement, globalThis.MouseEvent>
      | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const { selectionStart, value } = e.target as HTMLTextAreaElement;
    const rows = value.slice(0, selectionStart).split('\n');
    const row = rows.length;
    const col = rows[rows.length - 1].length;
    setSelection({
      line: row,
      column: col,
      position: selectionStart,
    });
  };

  return (
    <div className="space-y-5 h-full flex flex-col mb-5">
      <h1 className="text-3xl">Text Case Converter and Inspector</h1>

      <div>
        <h2>Convert</h2>
        <div className="flex gap-3 flex-wrap" onClick={handleBtnClick}>
          <button
            data-case-type="originalText"
            disabled={textCase === 'originalText'}
            className="bg-white border shadow rounded-md px-3 py-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            Original text
          </button>
          <button
            data-case-type="sentenceCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            Sentence case
          </button>
          <button
            data-case-type="lowerCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            lower case
          </button>
          <button
            data-case-type="upperCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            UPPER CASE
          </button>
          <button
            data-case-type="titleCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            Title Case
          </button>
          <button
            data-case-type="camelCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            camelCase
          </button>
          <button
            data-case-type="pascalCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            PascalCase
          </button>
          <button
            data-case-type="snakeCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            snake_case
          </button>
          <button
            data-case-type="constantCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            CONSTANT_CASE
          </button>
          <button
            data-case-type="kebabCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            kebab-case
          </button>
          <button
            data-case-type="cobolCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            COBOL-CASE
          </button>
          <button
            data-case-type="trainCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            Train-Case
          </button>
          <button
            data-case-type="alternatingCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            aLtErNaTiNg cAsE
          </button>
          <button
            data-case-type="inverseCase"
            className="bg-white border shadow rounded-md px-3 py-2"
          >
            InVeRsE CaSe
          </button>
        </div>
      </div>

      <div className="flex gap-5 flex-1">
        <div className="flex-1 flex flex-col">
          <PasteLoadClearBar
            withCopy
            title="String"
            onValueChange={(value) => {
              setInputString(value);
              setBackupString(value);
            }}
            onCopy={() => writeClipboard()}
          />
          <textarea
            className="w-full flex-1 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
            value={inputString}
            onChange={(e) => {
              setInputString(e.target.value);
              setBackupString(e.target.value);
            }}
            onClick={handleSelectionChange}
            onKeyUp={handleSelectionChange}
          ></textarea>
        </div>
        <div className="w-64 pt-[3.25rem]">
          <div className="bg-white h-full border shadow rounded-md overflow-y-auto space-y-3 px-3 py-5 text-sm">
            <div className="space-y-1">
              <h2>Selection</h2>
              <div className="flex justify-between">
                <span>Line:</span>
                <span>{selection.line}</span>
              </div>
              <div className="flex justify-between">
                <span>Column:</span>
                <span>{selection.column}</span>
              </div>
              <div className="flex justify-between">
                <span>Position:</span>
                <span>{selection.position}</span>
              </div>
            </div>
            <div className="space-y-1">
              <h2>Statistics</h2>
              <div className="flex justify-between">
                <span>Characters:</span>
                <span>{statistics.characters}</span>
              </div>
              <div className="flex justify-between">
                <span>Words:</span>
                <span>{statistics.words}</span>
              </div>
              <div className="flex justify-between">
                <span>Lines:</span>
                <span>{statistics.lines}</span>
              </div>
              <div className="flex justify-between">
                <span>Sentences:</span>
                <span>{statistics.sentences}</span>
              </div>
              <div className="flex justify-between">
                <span>Paragraphs:</span>
                <span>{statistics.paragraphs}</span>
              </div>
              <div className="flex justify-between">
                <span>Bytes:</span>
                <span>{statistics.bytes}</span>
              </div>
            </div>
            <div className="space-y-1">
              <h2>Word distribution</h2>
              <div className="w-full min-h-[3rem] max-h-52 bg-white border shadow rounded-md p-2 overflow-auto">
                {wordFrequency.map((word) => (
                  <div key={word.key}>
                    {word.key}: {word.value}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <h2>Character distribution</h2>
              <div className="w-full min-h-[3rem] max-h-52 bg-white border shadow rounded-md p-2 overflow-auto">
                {characterFrequency.map((char) => (
                  <div key={char.key}>
                    {char.key}: {char.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InspectorCaseConverter;

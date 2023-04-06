'use client';

import SelectSetting from '@/components/SelectSetting';
import SwitchSetting from '@/components/SwitchSetting';
import {
  Bars3BottomRightIcon,
  HashtagIcon,
  Cog8ToothIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { loremIpsum } from 'lorem-ipsum';
import { LoremUnit } from 'lorem-ipsum/types/src/constants/units';
import { useEffect, useRef, useState } from 'react';

const typeOptions: LoremUnit[] = ['words', 'sentences', 'paragraphs'];
const prefixArray = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];

function LoremIpsumPage() {
  const [type, setType] = useState<LoremUnit>(typeOptions[0]);
  const [length, setLength] = useState(1);
  const [withPrefix, setWithPrefix] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const writeClipboard = () => {
    const text = outputRef.current?.value || '';
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(text);
    }
  };

  const replacePrefixForWord = (words: string) => {
    const wordArray = words.split(' ');
    const minLength = Math.min(prefixArray.length, wordArray.length);
    for (let i = 0; i < minLength; i++) {
      wordArray[i] = prefixArray[i];
    }
    return wordArray.join(' ');
  };

  const generateLoremIpsum = () => {
    const text = loremIpsum({
      count: length,
      units: type,
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 5,
      paragraphUpperBound: 15,
      format: 'plain',
      random: Math.random,
      suffix: '\n',
    });
    if (withPrefix) {
      if (type === 'words') {
        outputRef.current &&
          (outputRef.current.value = replacePrefixForWord(text));
      } else {
        const lines = text.split('\n');
        const newFirstLine = replacePrefixForWord(lines[0]);
        lines[0] = newFirstLine;
        outputRef.current && (outputRef.current.value = lines.join('\n'));
      }
    } else {
      outputRef.current && (outputRef.current.value = text);
    }
  };

  useEffect(() => {
    generateLoremIpsum();
  }, [type, length, withPrefix]);

  return (
    <div className="space-y-5 flex flex-col h-full">
      <h1 className="text-3xl">Lorem Ipsum Generator</h1>

      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <SelectSetting
            Icon={Bars3BottomRightIcon}
            value={type}
            onChange={(value) => setType(value as LoremUnit)}
            title="Type"
            subTitle="Generate words, sentences or paragraphs of Lorem ipsum"
            options={typeOptions}
            optionValueFormatter={(value) =>
              value[0].toUpperCase() + value.slice(1)
            }
          />
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 mb-5 h-20">
            <div>
              <HashtagIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-start flex-1">
              <span className="text-lg">Length</span>
              <span className="text-xs">
                Number of words, sentences or paragraphs to generate
              </span>
            </div>
            <div className="px-3 py-2 shadow border rounded-md">
              <input
                className="w-full outline-none py-1 px-2"
                type="number"
                min={1}
                max={100}
                value={length}
                step={1}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  if (Number.isInteger(num) && num >= 1 && num <= 100) {
                    setLength(num);
                  }
                }}
              />
            </div>
          </div>
          <SwitchSetting
            Icon={Cog8ToothIcon}
            value={withPrefix}
            onChange={(checked) => setWithPrefix(checked)}
            title="Start with 'Lorem ipsum dolor sit amet...'"
            trueValue="On"
            falseValue="Off"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2>Output</h2>
          <div className="flex gap-3">
            <button
              className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
              title="Refresh"
              onClick={() => generateLoremIpsum()}
            >
              <ArrowPathIcon className="w-6 h-6" />
              Refresh
            </button>
            <button
              className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
              title="Copy"
              onClick={writeClipboard}
            >
              <DocumentDuplicateIcon className="w-6 h-6" />
              Copy
            </button>
            <button
              className="bg-white rounded-md px-3 py-2 shadow"
              title="Clear"
              onClick={() => (outputRef.current!.value = '')}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <textarea
          ref={outputRef}
          className="w-full flex-1 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          readOnly
        ></textarea>
      </div>
    </div>
  );
}

export default LoremIpsumPage;

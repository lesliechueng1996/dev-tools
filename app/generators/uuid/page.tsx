'use client';

import SelectSetting from '@/components/SelectSetting';
import SwitchSetting from '@/components/SwitchSetting';
import {
  AdjustmentsHorizontalIcon,
  DocumentDuplicateIcon,
  LanguageIcon,
  MinusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { v1, v4 } from 'uuid';

const versionList = ['1', '4 (GUID)'];

function UuidPage() {
  const [useHyphen, setUseHyphen] = useState(true);
  const [useUppercase, setUseUppercase] = useState(false);
  const [version, setVersion] = useState(versionList[1]);
  const [number, setNumber] = useState(4);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const writeClipboard = () => {
    const text = outputRef.current?.value || '';
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(text);
    }
  };

  const generateUUID = () => {
    const uuid = version === '1' ? v1 : v4;
    const uuids = [];
    for (let i = 0; i < number; i++) {
      let temp = uuid();
      if (!useHyphen) {
        temp = temp.replace(/-/g, '');
      }
      if (useUppercase) {
        temp = temp.toUpperCase();
      }
      uuids.push(temp);
    }
    outputRef.current!.value = uuids.join('\n');
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      <h1 className="text-3xl">UUID Generator</h1>

      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <SwitchSetting
            Icon={MinusIcon}
            value={useHyphen}
            onChange={(checked) => {
              setUseHyphen(checked);
            }}
            title="Hyphens"
            trueValue="On"
            falseValue="Off"
          />

          <SwitchSetting
            Icon={LanguageIcon}
            value={useUppercase}
            onChange={(checked) => {
              setUseUppercase(checked);
            }}
            title="Uppercase"
            trueValue="On"
            falseValue="Off"
          />

          <SelectSetting
            Icon={AdjustmentsHorizontalIcon}
            value={version}
            onChange={(value) => setVersion(value)}
            title="UUID version"
            subTitle="Choose the version of UUID to generate"
            options={versionList}
          />
        </div>
      </div>

      <div>
        <h2>Generate</h2>
        <div className="flex gap-2 items-center">
          <button
            className="border rounded-md px-3 py-2 text-white bg-sky-700"
            onClick={generateUUID}
          >
            Generate UUID(s)
          </button>
          <span className="font-bold">x</span>
          <input
            className="outline-none py-1 px-2 rounded-sm shadow border"
            type="number"
            value={number}
            min={1}
            max={10000}
            step={1}
            onChange={(e) => {
              const temp = Math.floor(Number(e.target.value));
              if (temp >= 1 && temp <= 10000) {
                setNumber(temp);
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2>UUID(s)</h2>
          <div className="flex gap-3 items-center">
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
              onClick={() => {
                outputRef.current!.value = '';
              }}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <textarea
          className="w-full flex-1 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          ref={outputRef}
          readOnly
        ></textarea>
      </div>
    </div>
  );
}

export default UuidPage;

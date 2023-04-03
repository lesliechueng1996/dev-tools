'use client';

import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import {
  ArrowsRightLeftIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';

function EscapeUnescapePage() {
  const [isEscape, setIsEscape] = useState(true);
  const [inputText, setInputText] = useState('');
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const writeClipboard = () => {
    const text = outputRef.current?.value || '';
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(text);
    }
  };

  useEffect(() => {
    if (isEscape) {
      escape();
    } else {
      unescape();
    }
  }, [inputText, isEscape]);

  const escape = () => {
    const str = inputText.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    outputRef.current && (outputRef.current.value = str);
  };

  const unescape = () => {
    const str = inputText.replace(/\\\\"/g, '"').replace(/\\\\/g, '\\');
    outputRef.current && (outputRef.current.value = str);
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      <h1 className="text-3xl">Text Escape / Unescape</h1>

      <div>
        <h2>Configuration</h2>
        <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
          <div>
            <ArrowsRightLeftIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col justify-start flex-1">
            <span className="text-lg">Conversion</span>
            <span className="text-xs">
              Select which conversion mode you want to use
            </span>
          </div>
          <div>{isEscape ? 'Escape' : 'Unescape'}</div>
          <div>
            <Switch
              checked={isEscape}
              onChange={(checked) => {
                setIsEscape(checked);
                const temp = inputText.slice();
                setInputText(outputRef.current?.value || '');
                outputRef.current && (outputRef.current.value = temp);
              }}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#0369A1"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <PasteLoadClearBar
          title="Input"
          onValueChange={(value) => setInputText(value)}
        />
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full flex-1 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
        ></textarea>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2>Output</h2>
          <button
            className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
            title="Copy"
            onClick={writeClipboard}
          >
            <DocumentDuplicateIcon className="w-6 h-6" />
            Copy
          </button>
        </div>
        <textarea
          className="w-full flex-1 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          readOnly
          ref={outputRef}
        ></textarea>
      </div>
    </div>
  );
}

export default EscapeUnescapePage;

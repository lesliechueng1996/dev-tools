'use client';

import useDebounce from '@/hooks/useDebounce';
import {
  ArrowsRightLeftIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import he from 'he';

function HtmlPage() {
  const [isEncode, setIsEncode] = useState(true);
  const [input, setInput] = useState('');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const realInput = useDebounce(input, 500);

  useEffect(() => {
    const temp = outputRef.current!.value;
    outputRef.current!.value = inputRef.current!.value;
    inputRef.current!.value = temp;
  }, [isEncode]);

  useEffect(() => {
    if (realInput === '') {
      outputRef.current!.value = '';
      return;
    }

    try {
      if (isEncode) {
        outputRef.current!.value = he.encode(realInput);
      } else {
        outputRef.current!.value = he.decode(realInput);
      }
    } catch (e) {
      console.log(e);
    }
  }, [realInput, isEncode]);

  const readClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        setInput(text);
      });
    }
  };

  const chooseFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const onChangeFile = () => {
    if (inputFileRef.current && inputFileRef.current.files) {
      const file = inputFileRef.current.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const fileContent = reader.result as string;
        setInput(fileContent);
      });

      reader.readAsText(file);

      inputFileRef.current.value = '';
    }
  };

  const writeClipboard = () => {
    const text = outputRef.current?.value || '';
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">HTML Encoder / Decoder</h1>

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
          <div>{isEncode ? 'Encode' : 'Decode'}</div>
          <div>
            <Switch
              checked={isEncode}
              onChange={(checked) => {
                setIsEncode(checked);
              }}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#0369A1"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-3">
          <h2>Input</h2>
          <div className="flex gap-3">
            <button
              className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
              title="Paste"
              onClick={readClipboard}
            >
              <ClipboardDocumentCheckIcon className="w-6 h-6" />
              Paste
            </button>
            <button
              className="bg-white rounded-md px-3 py-2 shadow"
              title="Load a file"
              onClick={chooseFile}
            >
              <DocumentIcon className="w-6 h-6" />
              <input
                type="file"
                accept="text/*"
                className="hidden"
                ref={inputFileRef}
                onChange={onChangeFile}
              />
            </button>
            <button
              className="bg-white rounded-md px-3 py-2 shadow"
              title="Clear"
              onClick={() => setInput('')}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <textarea
          ref={inputRef}
          className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-3">
          <h2>Output</h2>
          <div>
            <button
              className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
              title="Copy"
              onClick={writeClipboard}
            >
              <DocumentDuplicateIcon className="w-6 h-6" />
              Copy
            </button>
          </div>
        </div>
        <textarea
          className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          ref={outputRef}
          readOnly
        ></textarea>
      </div>
    </div>
  );
}

export default HtmlPage;

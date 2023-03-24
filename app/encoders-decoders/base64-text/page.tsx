'use client';

import {
  ArrowsRightLeftIcon,
  LanguageIcon,
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import useDebounce from '@/hooks/useDebounce';

const encodingList = ['UTF-8', 'ASCII'];

function Base64TextPage() {
  const [isEncode, setIsEncode] = useState(true);
  const [encoding, setEncoding] = useState(encodingList[0]);
  const [inputText, setInputText] = useState('');
  const inputValue = useRef('');
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const realInputText = useDebounce(inputText, 500);

  useEffect(() => {
    inputValue.current = realInputText;
  }, [realInputText]);

  useEffect(() => {
    try {
      if (isEncode) {
        const str = Base64.stringify(Utf8.parse(inputValue.current));
        outputRef.current && (outputRef.current.value = str);
      } else {
        const str = Utf8.stringify(Base64.parse(inputValue.current));
        outputRef.current && (outputRef.current.value = str);
      }
    } catch (e) {
      console.log(e);
      outputRef.current!.value = '??';
    }
  }, [realInputText, isEncode]);

  const clearInput = () => {
    setInputText('');
  };

  const readClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        setInputText(text);
      });
    }
  };

  const writeClipboard = () => {
    const text = outputRef.current?.value || '';
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(text);
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
        setInputText(fileContent);
      });

      reader.readAsText(file);

      inputFileRef.current.value = '';
    }
  };

  return (
    <div>
      <h1 className="text-3xl mb-5">Base64 Text Encoder / Decoder</h1>
      <div>
        <div>
          <h2>Configuration</h2>
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 mb-5 h-20">
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
                  inputValue.current = outputRef.current!.value;
                  setInputText(inputValue.current);
                  setIsEncode(checked);
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#0369A1"
              />
            </div>
          </div>
          {/* <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20 mb-5">
            <div>
              <LanguageIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-start flex-1">
              <span className="text-lg">Encoding</span>
              <span className="text-xs">
                Select which encoding do you want to use
              </span>
            </div>
            <div className="px-3 py-2 shadow border rounded-md">
              <select
                value={encoding}
                onChange={(e) => setEncoding(e.target.value)}
              >
                {encodingList.map((option) => (
                  <option value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div> */}
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
                onClick={clearInput}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
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
    </div>
  );
}

export default Base64TextPage;

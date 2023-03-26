'use client';

import DragDropFile from '@/components/DragDropFile';
import {
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import md5 from 'crypto-js/md5';
import sha1 from 'crypto-js/sha1';
import sha256 from 'crypto-js/sha256';
import sha384 from 'crypto-js/sha384';
import sha512 from 'crypto-js/sha512';
import hex from 'crypto-js/enc-hex';
import TipBlock from '@/components/TipBlock';

const algorithmList = ['MD5', 'SHA1', 'SHA256', 'SHA384', 'SHA512'];
const getHashHelper = (algorithm: string) => {
  switch (algorithm) {
    case 'MD5':
      return md5;
    case 'SHA1':
      return sha1;
    case 'SHA256':
      return sha256;
    case 'SHA384':
      return sha384;
    case 'SHA512':
      return sha512;
    default:
      return md5;
  }
};

let cacheFileContent: ArrayBuffer;

function CheckSumPage() {
  const [isUppercase, setIsUppercase] = useState(true);
  const [algorithm, setAlgorithm] = useState(algorithmList[0]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [output, setOutput] = useState('');
  const [outputCompare, setOutputCompare] = useState('');
  const outputFileRef = useRef<HTMLInputElement>(null);

  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(output);
    }
  };

  const readClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        setOutputCompare(text);
      });
    }
  };

  const onChangeFile = () => {
    if (outputFileRef.current && outputFileRef.current.files) {
      const file = outputFileRef.current.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const fileContent = reader.result as string;
        setOutputCompare(fileContent);
      });

      reader.readAsText(file);

      outputFileRef.current.value = '';
    }
  };

  const hashFile = () => {
    if (!cacheFileContent) {
      return;
    }
    const fileHex = Buffer.from(cacheFileContent).toString('hex');
    const helper = getHashHelper(algorithm);
    const text = hex.stringify(helper(hex.parse(fileHex)));
    setOutput(isUppercase ? text.toUpperCase() : text.toLowerCase());
  };

  useEffect(() => {
    hashFile();
  }, [algorithm]);

  useEffect(() => {
    setOutput(isUppercase ? output.toUpperCase() : output.toLowerCase());
  }, [isUppercase]);

  useEffect(() => {
    if (!outputCompare || !output) {
      setIsCorrect(null);
      return;
    }

    setIsCorrect(outputCompare.toLowerCase() === output.toLowerCase());
  }, [output, outputCompare]);

  return (
    <div>
      <h1 className="text-3xl mb-5">Checksum Generator</h1>
      <div>
        <div>
          <h2>Configuration</h2>
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 mb-5 h-20">
            <div>
              <ArrowsUpDownIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">Uppercase</div>
            <div>{isUppercase ? 'On' : 'Off'}</div>
            <div>
              <Switch
                checked={isUppercase}
                onChange={(checked) => {
                  setIsUppercase(checked);
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#0369A1"
              />
            </div>
          </div>
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 mb-5 h-20">
            <div>
              <ArrowsRightLeftIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-start flex-1">
              <span className="text-lg">Hashing Algorithm</span>
              <span className="text-xs">
                Select which hashing algorithm you want to use
              </span>
            </div>
            <div className="px-3 py-2 shadow border rounded-md">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
              >
                {algorithmList.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <DragDropFile
            className="bg-white"
            acceptAll
            onFileLoad={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                cacheFileContent = e.target?.result as ArrayBuffer;
                hashFile();
              };
              reader.readAsArrayBuffer(file);
            }}
          />
        </div>
        <div className="mb-5">
          <h2>Output</h2>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              className="flex-1 py-2 px-3 rounded-md outline-none bt-white shadow border"
              value={output}
              readOnly
            />
            <button
              className="border shadow rounded-md px-3 py-2 bg-white"
              title="Copy"
              onClick={writeClipboard}
            >
              <DocumentDuplicateIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <h2>Output Comparer</h2>
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
                onClick={() => outputFileRef.current?.click()}
              >
                <DocumentIcon className="w-6 h-6" />
                <input
                  type="file"
                  accept="text/*"
                  className="hidden"
                  ref={outputFileRef}
                  onChange={onChangeFile}
                />
              </button>
              <button
                className="bg-white rounded-md px-3 py-2 shadow"
                title="Clear"
                onClick={() => setOutputCompare('')}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <input
            value={outputCompare}
            onChange={(e) => setOutputCompare(e.target.value)}
            type="text"
            className="w-full py-2 px-3 rounded-md outline-none bt-white shadow border"
          />
        </div>
        {isCorrect !== null && (
          <TipBlock
            type={isCorrect ? 'success' : 'error'}
            msg={
              isCorrect
                ? 'The hashes are the same.'
                : 'The hashes are different.'
            }
          />
        )}
      </div>
    </div>
  );
}

export default CheckSumPage;

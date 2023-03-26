'use client';

import useDebounce from '@/hooks/useDebounce';
import {
  LanguageIcon,
  AdjustmentsHorizontalIcon,
  InboxIcon,
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import HAMC_MD5 from 'crypto-js/hmac-md5';
import HAMC_SHA1 from 'crypto-js/hmac-sha1';
import HAMC_SHA256 from 'crypto-js/hmac-sha256';
import HAMC_SHA512 from 'crypto-js/hmac-sha512';
import MD5 from 'crypto-js/md5';
import SHA1 from 'crypto-js/sha1';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';
import HEX from 'crypto-js/enc-hex';
import BASE64 from 'crypto-js/enc-base64';

const options = ['Hex', 'Base64'];

const getEncodeHelper = (type: string) => {
  if (type === 'Hex') {
    return HEX;
  }
  return BASE64;
};

function HashPage() {
  const [isUppercase, setIsUppercase] = useState(false);
  const [outputType, setOutputType] = useState(options[0]);
  const [useHMAC, setUseHMAC] = useState(false);
  const [input, setInput] = useState('');
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [secret, setSecret] = useState('');
  const inputSecretFileRef = useRef<HTMLInputElement>(null);

  const [md5, setMd5] = useState('');
  const [sha1, setSha1] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');

  const realInput = useDebounce(input, 500);
  const realSecret = useDebounce(secret, 500);

  useEffect(() => {
    const encodeHelper = getEncodeHelper(outputType);
    if (!useHMAC) {
      const md5Value = encodeHelper.stringify(MD5(realInput));
      const sha1Value = encodeHelper.stringify(SHA1(realInput));
      const sha256Value = encodeHelper.stringify(SHA256(realInput));
      const sha512Value = encodeHelper.stringify(SHA512(realInput));

      setMd5(isUppercase ? md5Value.toUpperCase() : md5Value.toLowerCase());
      setSha1(isUppercase ? sha1Value.toUpperCase() : sha1Value.toLowerCase());
      setSha256(
        isUppercase ? sha256Value.toUpperCase() : sha256Value.toLowerCase()
      );
      setSha512(
        isUppercase ? sha512Value.toUpperCase() : sha512Value.toLowerCase()
      );
    } else {
      const md5Value = encodeHelper.stringify(HAMC_MD5(realInput, realSecret));
      const sha1Value = encodeHelper.stringify(
        HAMC_SHA1(realInput, realSecret)
      );
      const sha256Value = encodeHelper.stringify(
        HAMC_SHA256(realInput, realSecret)
      );
      const sha512Value = encodeHelper.stringify(
        HAMC_SHA512(realInput, realSecret)
      );

      setMd5(isUppercase ? md5Value.toUpperCase() : md5Value.toLowerCase());
      setSha1(isUppercase ? sha1Value.toUpperCase() : sha1Value.toLowerCase());
      setSha256(
        isUppercase ? sha256Value.toUpperCase() : sha256Value.toLowerCase()
      );
      setSha512(
        isUppercase ? sha512Value.toUpperCase() : sha512Value.toLowerCase()
      );
    }
  }, [realInput, outputType, isUppercase, useHMAC, realSecret]);

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

  const readSecretClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        setSecret(text);
      });
    }
  };

  const chooseFileForSecret = () => {
    if (inputSecretFileRef.current) {
      inputSecretFileRef.current.click();
    }
  };

  const onSecretChangeFile = () => {
    if (inputSecretFileRef.current && inputSecretFileRef.current.files) {
      const file = inputSecretFileRef.current.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const fileContent = reader.result as string;
        setSecret(fileContent);
      });

      reader.readAsText(file);

      inputSecretFileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Hash Generator</h1>

      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <LanguageIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">Uppercase</span>
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
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <AdjustmentsHorizontalIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">Output Type</span>
            <div className="px-3 py-2 shadow border rounded-md">
              <select
                value={outputType}
                onChange={(e) => setOutputType(e.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <InboxIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">HMAC Mode</span>
            <div>{useHMAC ? 'On' : 'Off'}</div>
            <div>
              <Switch
                checked={useHMAC}
                onChange={(checked) => {
                  setUseHMAC(checked);
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#0369A1"
              />
            </div>
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
          className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>

      {useHMAC && (
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <h2>Secret Key</h2>
            <div className="flex gap-3">
              <button
                className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
                title="Paste"
                onClick={readSecretClipboard}
              >
                <ClipboardDocumentCheckIcon className="w-6 h-6" />
                Paste
              </button>
              <button
                className="bg-white rounded-md px-3 py-2 shadow"
                title="Load a file"
                onClick={chooseFileForSecret}
              >
                <DocumentIcon className="w-6 h-6" />
                <input
                  type="file"
                  accept="text/*"
                  className="hidden"
                  ref={inputSecretFileRef}
                  onChange={onSecretChangeFile}
                />
              </button>
              <button
                className="bg-white rounded-md px-3 py-2 shadow"
                title="Clear"
                onClick={() => setSecret('')}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          ></textarea>
        </div>
      )}

      <div>
        <h2>MD5</h2>
        <div className="flex items-center gap-3">
          <input
            className="flex-1 border shadow rounded-md outline-none px-3 py-2"
            value={md5}
            readOnly
          />
          <button className="shadow border rounded-md py-2 px-3 bg-white">
            <DocumentDuplicateIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div>
        <h2>SHA1</h2>
        <div className="flex items-center gap-3">
          <input
            className="flex-1 border shadow rounded-md outline-none px-3 py-2"
            value={sha1}
            readOnly
          />
          <button className="shadow border rounded-md py-2 px-3 bg-white">
            <DocumentDuplicateIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div>
        <h2>SHA256</h2>
        <div className="flex items-center gap-3">
          <input
            className="flex-1 border shadow rounded-md outline-none px-3 py-2"
            value={sha256}
            readOnly
          />
          <button className="shadow border rounded-md py-2 px-3 bg-white">
            <DocumentDuplicateIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div>
        <h2>SHA512</h2>
        <div className="flex items-center gap-3">
          <input
            className="flex-1 border shadow rounded-md outline-none px-3 py-2"
            value={sha512}
            readOnly
          />
          <button className="shadow border rounded-md py-2 px-3 bg-white">
            <DocumentDuplicateIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HashPage;

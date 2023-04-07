'use client';

import DragDropFile from '@/components/DragDropFile';
import {
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import md5 from 'crypto-js/md5';
import sha1 from 'crypto-js/sha1';
import sha256 from 'crypto-js/sha256';
import sha384 from 'crypto-js/sha384';
import sha512 from 'crypto-js/sha512';
import hex from 'crypto-js/enc-hex';
import TipBlock from '@/components/TipBlock';
import SwitchSetting from '@/components/SwitchSetting';
import SelectSetting from '@/components/SelectSetting';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import CopyInput from '@/components/CopyInput';

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
    <div className="space-y-5">
      <h1 className="text-3xl">Checksum Generator</h1>
      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <SwitchSetting
            Icon={ArrowsUpDownIcon}
            value={isUppercase}
            onChange={(checked) => setIsUppercase(checked)}
            title="Uppercase"
            trueValue="On"
            falseValue="Off"
          />
          <SelectSetting
            Icon={ArrowsRightLeftIcon}
            value={algorithm}
            onChange={(value: string) => setAlgorithm(value)}
            title="Hashing Algorithm"
            subTitle="Select which hashing algorithm you want to use"
            options={algorithmList}
          />
        </div>
      </div>

      <div>
        <DragDropFile
          className="theme-bg"
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

      <CopyInput title="Output" value={output} />

      <div>
        <PasteLoadClearBar
          title="Output Comparer"
          onValueChange={(value) => setOutputCompare(value)}
        />
        <input
          value={outputCompare}
          onChange={(e) => setOutputCompare(e.target.value)}
          type="text"
          className="w-full py-2 px-3 outline-none theme-bg theme-border"
        />
      </div>
      {isCorrect !== null && (
        <TipBlock
          type={isCorrect ? 'success' : 'error'}
          msg={
            isCorrect ? 'The hashes are the same.' : 'The hashes are different.'
          }
        />
      )}
    </div>
  );
}

export default CheckSumPage;

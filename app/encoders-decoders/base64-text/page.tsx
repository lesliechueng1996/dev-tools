'use client';

import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import useDebounce from '@/hooks/useDebounce';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import CopyBar from '@/components/CopyBar';
import SwitchSetting from '@/components/SwitchSetting';

const encodingList = ['UTF-8', 'ASCII'];

function Base64TextPage() {
  const [isEncode, setIsEncode] = useState(true);
  const [encoding, setEncoding] = useState(encodingList[0]);
  const [inputText, setInputText] = useState('');
  const inputValue = useRef('');
  const outputRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Base64 Text Encoder / Decoder</h1>
      <div>
        <h2>Configuration</h2>
        <SwitchSetting
          Icon={ArrowsRightLeftIcon}
          value={isEncode}
          onChange={(checked) => {
            inputValue.current = outputRef.current!.value;
            setInputText(inputValue.current);
            setIsEncode(checked);
          }}
          title="Conversion"
          subTitle="Select which conversion mode you want to use"
          trueValue="Encode"
          falseValue="Decode"
        />

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
        <PasteLoadClearBar
          title="Input"
          onValueChange={(value) => setInputText(value)}
        />
        <textarea
          className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
      </div>

      <div>
        <CopyBar
          title="Output"
          getNeedCopyText={() => outputRef.current?.value || ''}
        />
        <textarea
          className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          ref={outputRef}
          readOnly
        ></textarea>
      </div>
    </div>
  );
}

export default Base64TextPage;

'use client';

import useDebounce from '@/hooks/useDebounce';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import he from 'he';
import SwitchSetting from '@/components/SwitchSetting';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import CopyBar from '@/components/CopyBar';

function HtmlPage() {
  const [isEncode, setIsEncode] = useState(true);
  const [input, setInput] = useState('');
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

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">HTML Encoder / Decoder</h1>

      <div>
        <h2>Configuration</h2>
        <SwitchSetting
          Icon={ArrowsRightLeftIcon}
          value={isEncode}
          onChange={(checked) => setIsEncode(checked)}
          title="Conversion"
          subTitle="Select which conversion mode you want to use"
          trueValue="Encode"
          falseValue="Decode"
        />
      </div>

      <div>
        <PasteLoadClearBar
          title="Input"
          onValueChange={(value) => setInput(value)}
        />
        <textarea
          ref={inputRef}
          className="w-full h-56 theme-bg theme-border resize-none outline-none p-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>

      <div>
        <CopyBar
          title="Output"
          getNeedCopyText={() => outputRef.current?.value || ''}
        />
        <textarea
          className="w-full h-56 theme-bg theme-border resize-none outline-none p-3"
          ref={outputRef}
          readOnly
        ></textarea>
      </div>
    </div>
  );
}

export default HtmlPage;

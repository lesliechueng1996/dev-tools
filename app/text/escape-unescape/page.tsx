'use client';

import CopyBar from '@/components/CopyBar';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import SwitchSetting from '@/components/SwitchSetting';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

function EscapeUnescapePage() {
  const [isEscape, setIsEscape] = useState(true);
  const [inputText, setInputText] = useState('');
  const outputRef = useRef<HTMLTextAreaElement>(null);

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
        <SwitchSetting
          Icon={ArrowsRightLeftIcon}
          value={isEscape}
          onChange={(checked) => {
            setIsEscape(checked);
            const temp = inputText.slice();
            setInputText(outputRef.current?.value || '');
            outputRef.current && (outputRef.current.value = temp);
          }}
          title="Conversion"
          subTitle="Select which conversion mode you want to use"
          trueValue="Escape"
          falseValue="Unescape"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <PasteLoadClearBar
          title="Input"
          onValueChange={(value) => setInputText(value)}
        />
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full flex-1 theme-bg theme-border resize-none outline-none p-3"
        ></textarea>
      </div>

      <div className="flex-1 flex flex-col">
        <CopyBar
          title="Output"
          getNeedCopyText={() => outputRef.current?.value || ''}
        />
        <textarea
          className="w-full flex-1 theme-bg theme-border resize-none outline-none p-3"
          readOnly
          ref={outputRef}
        ></textarea>
      </div>
    </div>
  );
}

export default EscapeUnescapePage;

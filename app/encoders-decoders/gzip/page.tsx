'use client';

import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import pako from 'pako';
import useDebounce from '@/hooks/useDebounce';
import SwitchSetting from '@/components/SwitchSetting';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import CopyBar from '@/components/CopyBar';

function GzipPage() {
  const [isCompress, setIsCompress] = useState(true);
  const [input, setInput] = useState('');
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const realInput = useDebounce(input, 500);

  useEffect(() => {
    const temp = outputRef.current!.value;
    outputRef.current!.value = inputRef.current!.value;
    inputRef.current!.value = temp;
  }, [isCompress]);

  useEffect(() => {
    if (realInput === '') {
      outputRef.current!.value = '';
      return;
    }

    try {
      if (isCompress) {
        outputRef.current!.value = Buffer.from(
          pako.gzip(inputRef.current!.value)
        ).toString('base64');
      } else {
        outputRef.current!.value = Buffer.from(
          pako.ungzip(Buffer.from(inputRef.current!.value, 'base64'))
        ).toString('utf-8');
      }
    } catch (e) {
      console.log(e);
    }
  }, [realInput, isCompress]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">GZip Compress / Decompress</h1>

      <div>
        <h2>Configuration</h2>
        <SwitchSetting
          Icon={ArrowsRightLeftIcon}
          value={isCompress}
          onChange={(checked) => setIsCompress(checked)}
          title="GZip Compress / Decompress"
          subTitle="Select wether the input should be compressed or decompressed"
          trueValue="Compress"
          falseValue="Decompress"
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

export default GzipPage;

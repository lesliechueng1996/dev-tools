'use client';

import DragDropFile from '@/components/DragDropFile';
import SplitterView from '@/components/SplitterView';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import ImagePreview from '@/components/ImagePreview';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';

const acceptFiles = [
  '.png',
  '.jpg',
  '.jpeg',
  '.bmp',
  '.gif',
  '.ico',
  '.webp',
  '.svg',
];

function Base64ImagePage() {
  const [inputText, setInputText] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  const realInputText = useDebounce(inputText, 500);

  useEffect(() => {
    if (/^data:image\/([a-z]+);base64,/.test(realInputText)) {
      setImageSrc(realInputText);
    }
  }, [realInputText]);

  const Base64Panel = (
    <div className="h-full flex flex-col">
      <PasteLoadClearBar
        title="Base64"
        withCopy
        getNeedCopyText={() => inputText}
        onValueChange={(value) => {
          setInputText(value);
          if (!value) {
            setImageSrc('');
          }
        }}
      />
      <textarea
        className="w-full flex-1 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
        }}
      ></textarea>
    </div>
  );

  const ImagePanel = (
    <div className="h-full flex flex-col">
      <h2 className="mb-3 h-10 leading-10">Image</h2>
      <div className="mb-3">
        <DragDropFile
          acceptFiles={acceptFiles}
          onFileLoad={(file) => {
            const fileReader = new FileReader();
            fileReader.onload = (e: ProgressEvent<FileReader>) => {
              const data = e.target?.result;
              const base64Data = (data ?? '') as string;
              setImageSrc(base64Data);
              setInputText(base64Data);
            };

            fileReader.readAsDataURL(file);
          }}
        />
      </div>
      <ImagePreview imageSrc={imageSrc} />
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl mb-5">Base64 Image Encoder / Decoder</h1>
      <div className="flex-1">
        <SplitterView
          leftChild={Base64Panel}
          rightChild={ImagePanel}
          leftMin={500}
          rightMin={500}
        />
      </div>
    </div>
  );
}

export default Base64ImagePage;

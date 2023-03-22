'use client';

import SplitterView from '@/components/SplitterView';
import {
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

function Base64ImagePage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState('');

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
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(inputText);
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

  const Base64Panel = (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2>Base64</h2>
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
            className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
            title="Copy"
            onClick={writeClipboard}
          >
            <DocumentDuplicateIcon className="w-6 h-6" />
            Copy
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
      <div>
        <textarea
          className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
      </div>
    </div>
  );

  const ImagePanel = (
    <div>
      <h2>Image</h2>
      <div>// react-dropzone</div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl mb-5">Base64 Image Encoder / Decoder</h1>
      <div>
        <SplitterView
          leftChild={Base64Panel}
          rightChild={<div>456</div>}
          leftMin={100}
          rightMin={100}
        />
      </div>
    </div>
  );
}

export default Base64ImagePage;

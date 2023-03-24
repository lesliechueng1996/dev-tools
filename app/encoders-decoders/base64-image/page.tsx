'use client';

import DragDropFile from '@/components/DragDropFile';
import SplitterView from '@/components/SplitterView';
import {
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  XMarkIcon,
  EyeIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import useDebounce from '@/hooks/useDebounce';

function Base64ImagePage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const imageRef = useRef<HTMLImageElement>(null);

  const realInputText = useDebounce(inputText, 500);

  useEffect(() => {
    if (/^data:image\/([a-z]+);base64,/.test(realInputText)) {
      setImageSrc(realInputText);
    }
  }, [realInputText]);

  const clearInput = () => {
    setInputText('');
    setImageSrc('');
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

  // const saveImage = async () => {
  //   const dataUrl = imageSrc;
  //   const temp = imageSrc.split(';');
  //   const type = temp[0].split(':')[1];
  //   const blob = await (await fetch(dataUrl)).blob();
  //   navigator.clipboard
  //     .write([
  //       new ClipboardItem({
  //         [type]: blob,
  //       }),
  //     ])
  //     .then(() => {
  //       console.log('Copied image to clipboard');
  //     })
  //     .catch((error) => {
  //       console.error('Failed to copy image to clipboard: ', error);
  //     });
  // };

  function downloadImage() {
    const ext = imageSrc.split(';')[0].split(':')[1].split('/')[1];
    var link = document.createElement('a');
    link.href = imageSrc;
    link.download = `image.${ext}`;
    link.click();
  }

  const Base64Panel = (
    <div className="h-full flex flex-col">
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
          onImageLoad={(data: string) => {
            setImageSrc(data);
            setInputText(data);
          }}
        />
      </div>
      <div className="bg-white flex-1 rounded-md border shadow p-5">
        {imageSrc && (
          <div>
            <div className="flex gap-3 justify-end mb-3">
              <button
                className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
                onClick={() => {
                  const img = new Image();
                  img.src = imageSrc;

                  const newWin = window.open('', '_blank');
                  newWin!.document.write(img.outerHTML);
                  newWin!.document.title = 'Preview';
                  newWin!.document.close();
                }}
              >
                <EyeIcon className="w-6 h-6" />
                View
              </button>
              {/* <button
                className="bg-white rounded-md px-3 py-2 shadow"
                title="Copy"
                onClick={saveImage}
              >
                <DocumentDuplicateIcon className="w-6 h-6" />
              </button> */}
              <button
                className="bg-white rounded-md px-3 py-2 shadow"
                title="Save as"
                onClick={() => {
                  downloadImage();
                }}
              >
                <ServerIcon className="w-6 h-6" />
              </button>
            </div>
            <NextImage
              ref={imageRef}
              src={imageSrc}
              alt="preview"
              width={700}
              height={475}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>
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

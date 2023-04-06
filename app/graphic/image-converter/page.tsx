'use client';

import DragDropFile from '@/components/DragDropFile';
import SelectSetting from '@/components/SelectSetting';
import {
  ArrowsRightLeftIcon,
  TrashIcon,
  InboxArrowDownIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const imageType = ['PNG', 'JPEG', 'BMP'];

const imageTypeToMime = (type: string) => {
  switch (type) {
    case 'PNG':
      return 'image/png';
    case 'JPEG':
      return 'image/jpeg';
    case 'BMP':
      return 'image/bmp';
    default:
      return 'image/png';
  }
};

type FileItem = {
  id: string;
  ref: File;
};

const fileSizeToString = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
};

function ImageConverter() {
  const [type, setType] = useState(imageType[0]);
  const [fileList, setFileList] = useState<FileItem[]>([]);

  const removeFileFromFileList = (id: string) => {
    setFileList((prev) => prev.filter((file) => file.id !== id));
  };

  const saveFileAsType = (file: FileItem) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          canvas.toBlob(
            (blob) => {
              const url = URL.createObjectURL(blob!);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${file.ref.name}.${type.toLowerCase()}`;
              a.click();
              URL.revokeObjectURL(url);
            },
            imageTypeToMime(type),
            0.9
          );
        }
      };
      image.src = base64;
    };

    reader.readAsDataURL(file.ref);
  };

  const saveAllFileAsType = () => {
    fileList.forEach((file) => saveFileAsType(file));
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Image Converter</h1>

      <div>
        <h2>Configuration</h2>
        <SelectSetting
          Icon={ArrowsRightLeftIcon}
          value={type}
          onChange={(value) => setType(value)}
          title="Conversion"
          subTitle="Select the converted file format"
          options={imageType}
        />
      </div>

      <DragDropFile
        acceptFiles={['.png', '.jpg', '.jpeg', '.bmp']}
        multiFile
        onFilesLoad={(files) => {
          const temp: FileItem[] = [];
          for (let i = 0; i < files.length; i++) {
            temp.push({
              id: uuidv4(),
              ref: files[i],
            });
          }
          setFileList(temp);
        }}
      />

      <div className="flex justify-end gap-3">
        <button
          className="flex items-center gap-2 px-3 py-2 bg-sky-700 text-white rounded-md shadow"
          onClick={() => saveAllFileAsType()}
        >
          <InboxArrowDownIcon className="w-6 h-6" />
          <span>Save all</span>
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow"
          onClick={() => setFileList([])}
        >
          <TrashIcon className="w-6 h-6" />
          <span>Delete all</span>
        </button>
      </div>

      {fileList.length > 0 && (
        <ul className="space-y-3">
          {fileList.map((file) => (
            <li
              className="flex gap-5 items-center bg-white shadow border rounded-md px-7 py-5"
              key={file.id}
            >
              <div className="flex-1 flex flex-col">
                <span>{file.ref.name}</span>
                <span>{fileSizeToString(file.ref.size)}</span>
              </div>
              <button
                className="p-2 cursor-pointer hover:bg-slate-300/50 rounded-md transition-colors duration-300 ease-in"
                onClick={() => {
                  saveFileAsType(file);
                }}
              >
                <InboxArrowDownIcon className="w-6 h-6" title="Save as" />
              </button>
              <button
                className="p-2 cursor-pointer hover:bg-slate-300/50 rounded-md transition-colors duration-300 ease-in"
                onClick={() => removeFileFromFileList(file.id)}
              >
                <TrashIcon className="w-6 h-6 cursor-pointer" title="Delete" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ImageConverter;

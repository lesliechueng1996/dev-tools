'use client';

import DragDropFile from '@/components/DragDropFile';
import {
  InboxArrowDownIcon,
  TrashIcon,
  EllipsisHorizontalCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Compressor from 'compressorjs';
import { useDialog } from '@/components/DialogProvider';

type FileItemJob = {
  id: string;
  ref: File;
  status: 'completed' | 'pending' | 'error';
  compressRate: string;
  errorMsg?: string;
  blob?: Blob;
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

const imageTypeToMime = (fileName: string) => {
  const type = fileName.split('.').pop()?.toUpperCase();
  switch (type) {
    case 'PNG':
      return 'image/png';
    case 'JPEG':
      return 'image/jpeg';
    default:
      return 'image/png';
  }
};

let compressCount = 0;
function PngJpegCompressorPage() {
  const [fileList, setFileList] = useState<FileItemJob[]>([]);
  const compressing = useRef(false);
  const { showDialog } = useDialog();

  const compressFile = (file: FileItemJob) => {
    new Compressor(file.ref, {
      quality: 0.6,
      success: (result) => {
        compressCount++;
        setFileList((prev) => {
          const temp = [...prev];
          const index = temp.findIndex((f) => f.id === file.id);
          if (index < 0) {
            return prev;
          }
          temp[index] = {
            ...file,
            status: 'completed',
            blob: result,
            compressRate: `${((result.size / file.ref.size) * 100).toFixed(
              2
            )}%`,
          };
          return temp;
        });
      },
      error: (err) => {
        compressCount++;
        setFileList((prev) => {
          const temp = [...prev];
          const index = temp.findIndex((f) => f.id === file.id);
          if (index < 0) {
            return prev;
          }
          temp[index] = {
            ...file,
            status: 'error',
            errorMsg: err.message,
          };
          return temp;
        });
      },
    });
  };

  const saveAllFileAsType = () => {
    fileList.forEach((file) => saveImage(file));
  };

  useEffect(() => {
    if (compressCount === fileList.length) {
      compressing.current = false;
      compressCount = 0;
      return;
    }
    if (fileList.length > 0 && compressing.current === false) {
      compressing.current = true;
      fileList.forEach((file) => {
        if (file.status === 'pending') {
          compressFile(file);
        }
      });
    }
  }, [fileList]);

  const removeFileFromFileList = (id: string) => {
    setFileList((prev) => prev.filter((file) => file.id !== id));
  };

  const saveImage = (file: FileItemJob) => {
    if (file.blob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file.blob!);
      link.download = file.ref.name;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <div className="space-y-5">
      <h1>PNG / JPEG Compressor</h1>

      <DragDropFile
        acceptFiles={['.png', '.jpg', '.jpeg']}
        multiFile
        onFilesLoad={(files) => {
          const temp: FileItemJob[] = [];
          for (let i = 0; i < files.length; i++) {
            temp.push({
              id: uuidv4(),
              ref: files[i],
              status: 'pending',
              compressRate: '0%',
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
              <div>
                {file.status === 'pending' ? (
                  <EllipsisHorizontalCircleIcon className="w-6 h-6 text-blue-400" />
                ) : file.status === 'completed' ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <span>{file.ref.name}</span>
                <span>{fileSizeToString(file.ref.size)}</span>
              </div>
              {file.status === 'completed' && (
                <div className="flex flex-col">
                  <span>{file.compressRate}</span>
                  <span>{fileSizeToString(file.blob?.size ?? 0)}</span>
                </div>
              )}
              {file.status === 'error' && (
                <button
                  title="See details"
                  className="p-2 cursor-pointer hover:bg-slate-300/50 rounded-md transition-colors duration-300 ease-in"
                  onClick={() => {
                    showDialog('Details', file.errorMsg ?? '');
                  }}
                >
                  <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
                </button>
              )}
              {file.status === 'completed' && (
                <button
                  className="p-2 cursor-pointer hover:bg-slate-300/50 rounded-md transition-colors duration-300 ease-in"
                  onClick={() => {
                    saveImage(file);
                  }}
                  title="Save as"
                >
                  <InboxArrowDownIcon className="w-6 h-6" />
                </button>
              )}
              <button
                className="p-2 cursor-pointer hover:bg-slate-300/50 rounded-md transition-colors duration-300 ease-in"
                onClick={() => removeFileFromFileList(file.id)}
                title="Delete"
              >
                <TrashIcon className="w-6 h-6 cursor-pointer" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PngJpegCompressorPage;

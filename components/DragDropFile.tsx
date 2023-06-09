import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import path from 'path';

type Props = {
  acceptAll?: boolean;
  acceptFiles?: string[];
  onFileLoad?: (file: File) => void;
  className?: string;
  multiFile?: boolean;
  onFilesLoad?: (files: FileList) => void;
};

function DragDropFile({
  className = '',
  acceptAll = false,
  acceptFiles = [],
  multiFile = false,
  onFileLoad,
  onFilesLoad,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [onDrag, setOnDrag] = useState(false);

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOnDrag(true);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOnDrag(false);

    if (!multiFile && e.dataTransfer.files.length > 1) {
      toast.error('Only can upload one file');
      return;
    }

    if (!e.dataTransfer.types.includes('Files')) {
      toast.error('Only can upload file');
      return;
    }

    if (multiFile) {
      const files = e.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const extName = path.extname(file.name);
        if (!acceptAll && !acceptFiles.includes(extName)) {
          toast.error(`Only can upload ${acceptFiles.join(', ')} file`);
          return;
        }
      }
      onFilesLoad && onFilesLoad(e.dataTransfer.files);
      return;
    }

    const file = e.dataTransfer.files[0];
    const extName = path.extname(file.name);
    if (!acceptAll && !acceptFiles.includes(extName)) {
      toast.error(`Only can upload ${acceptFiles.join(', ')} file`);
      return;
    }

    onFileLoad && onFileLoad(file);
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (multiFile) {
        onFilesLoad && onFilesLoad(e.target.files);
        return;
      }
      const file = e.target.files[0];
      onFileLoad && onFileLoad(file);
    }
  };

  return (
    <div
      className={`w-full border-dashed border-2 rounded-md border-gray-400 px-10 py-8 flex flex-col items-center gap-3 transition-all duration-300 ${
        onDrag && 'scale-105'
      } ${className}`}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={() => setOnDrag(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInput}
        accept={acceptAll ? '*' : acceptFiles.join(', ')}
        multiple={multiFile}
        onChange={onChangeFile}
      />
      <div className="text-center">
        Drag & drop {!multiFile && 'a'}{' '}
        {acceptAll
          ? 'any'
          : acceptFiles
              .map((item) => item.substring(1).toUpperCase())
              .join(', ')}{' '}
        file here
      </div>
      <div>or</div>
      <div className="space-x-5">
        <button
          className="border-b-2 border-sky-800/70 text-sky-800/70 dark:border-cyan-400 dark:text-cyan-400"
          onClick={() => {
            fileInput.current!.value = '';
            fileInput.current!.click();
          }}
        >
          Browse files
        </button>
        {/* <span>/</span>
        <button
          className="border-b-2 border-sky-800/70 text-sky-800/70"
          onClick={readClipboard}
        >
          Paste
        </button> */}
      </div>
    </div>
  );
}

export default DragDropFile;

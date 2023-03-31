import {
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRef } from 'react';

type Props = {
  title: string;
  onValueChange: (text: string) => void;
};

function PasteLoadClearBar({ title, onValueChange }: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const chooseFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const readClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        onValueChange(text);
      });
    }
  };

  const onChangeFile = () => {
    if (inputFileRef.current && inputFileRef.current.files) {
      const file = inputFileRef.current.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const fileContent = reader.result as string;
        onValueChange(fileContent);
      });

      reader.readAsText(file);

      inputFileRef.current.value = '';
    }
  };

  return (
    <div className="flex justify-between items-baseline mb-3">
      <h2>{title}</h2>
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
          className="bg-white rounded-md px-3 py-2 shadow"
          title="Clear"
          onClick={() => onValueChange('')}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default PasteLoadClearBar;
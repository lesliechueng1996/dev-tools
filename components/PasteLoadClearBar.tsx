import {
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRef } from 'react';

type Props = {
  title: string;
  onValueChange: (text: string) => void;
  withCopy?: boolean;
  getNeedCopyText?: () => void;
};

function PasteLoadClearBar({
  title,
  onValueChange,
  withCopy = false,
  getNeedCopyText,
}: Props) {
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

  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    const text = getNeedCopyText && getNeedCopyText();
    if (clipboard && text) {
      clipboard.writeText(text);
    }
  };

  return (
    <div className="flex justify-between items-baseline mb-3">
      <h2>{title}</h2>
      <div className="flex gap-3">
        <button className="theme-button" title="Paste" onClick={readClipboard}>
          <ClipboardDocumentCheckIcon className="w-6 h-6" />
          Paste
        </button>
        <button
          className="theme-button"
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
        {withCopy && (
          <button
            className="theme-button"
            title="Copy"
            onClick={writeClipboard}
          >
            <DocumentDuplicateIcon className="w-6 h-6" />
            Copy
          </button>
        )}
        <button
          className="theme-button"
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

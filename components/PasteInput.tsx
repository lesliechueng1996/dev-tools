import {
  ClipboardDocumentCheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type Props = {
  title: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  className?: string;
  needClear?: boolean;
};

function PasteInput({
  title,
  value,
  onValueChange,
  onBlur,
  onFocus,
  className = '',
  needClear = false,
}: Props) {
  const readClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        onValueChange(text);
      });
    }
  };

  return (
    <div className={className}>
      <div className="px-3 py-2">
        <div className="flex justify-between items-center mb-2">
          <h2>{title}</h2>
          <button
            className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
            title="Paste"
            onClick={readClipboard}
          >
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            Paste
          </button>
        </div>
        <div className="flex gap-2">
          <input
            className="w-full outline-none py-1 px-2 rounded-sm shadow border"
            type="text"
            value={value}
            onChange={(e) => {
              onValueChange(e.target.value);
            }}
            onBlur={(e) => {
              onBlur && onBlur(e.target.value);
            }}
            onFocus={(e) => {
              onFocus && onFocus(e.target.value);
            }}
          />
          {needClear && (
            <button
              className="bg-white rounded-md px-3 py-2 shadow"
              title="Clear"
              onClick={() => {
                onValueChange('');
              }}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasteInput;

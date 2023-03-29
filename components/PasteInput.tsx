import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

type Props = {
  title: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
};

function PasteInput({ title, value, onValueChange, className = '' }: Props) {
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
        <div>
          <input
            className="w-full outline-none py-1 px-2 rounded-sm shadow border"
            type="text"
            value={value}
            onChange={(e) => {
              onValueChange(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PasteInput;

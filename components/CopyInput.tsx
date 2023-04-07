import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

type Props = {
  title: string;
  value: string;
};

function CopyInput({ title, value }: Props) {
  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(value);
    }
  };
  return (
    <div>
      <h2>{title}</h2>
      <div className="flex items-center gap-3">
        <input
          className="flex-1 theme-bg theme-border outline-none px-3 py-2"
          value={value}
          readOnly
        />
        <button className="theme-button" title="Copy" onClick={writeClipboard}>
          <DocumentDuplicateIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default CopyInput;

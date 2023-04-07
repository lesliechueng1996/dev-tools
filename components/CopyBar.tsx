import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

type Props = {
  title: string;
  getNeedCopyText: () => string;
};

function CopyBar({ title, getNeedCopyText }: Props) {
  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      const text = getNeedCopyText();
      clipboard.writeText(text);
    }
  };

  return (
    <div className="flex justify-between items-baseline mb-3">
      <h2>{title}</h2>
      <div>
        <button className="theme-button" title="Copy" onClick={writeClipboard}>
          <DocumentDuplicateIcon className="w-6 h-6" />
          Copy
        </button>
      </div>
    </div>
  );
}

export default CopyBar;

'use client';

import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import { DocumentDuplicateIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { micromark } from 'micromark';

type Editor = Parameters<OnMount>[0];

const options = ['light', 'dark'];

function MarkdownPreviewPage() {
  const [theme, setTheme] = useState(options[0]);
  const editorRef = useRef<Editor>(null);
  const [output, setOutput] = useState('');

  const handleEditorMount = (editor: Editor) => {
    editor.updateOptions({ minimap: { enabled: false } });
    editorRef.current = editor;
  };

  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      const html = micromark(output);
      clipboard.writeText(html);
    }
  };

  return (
    <div className="flex flex-col space-y-5 h-full">
      <h1 className="text-3xl">Markdown Preview</h1>

      <div>
        <h2>Configuration</h2>
        <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
          <div>
            <SwatchIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col justify-start flex-1">
            <span className="text-lg">Theme</span>
            <span className="text-xs">
              Select which theme to use to preview the Markdown
            </span>
          </div>
          <div className="px-3 py-2 shadow border rounded-md">
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option[0].toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-5 flex-1">
        <div className="flex-1 flex flex-col">
          <PasteLoadClearBar
            title="Markdown"
            onValueChange={(value) => editorRef.current.setValue(value)}
          />
          <div className="flex-1">
            <Editor
              defaultLanguage="json"
              onChange={(value) => {
                setOutput(value ?? '');
              }}
              onMount={handleEditorMount}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-baseline mb-3">
            <h2>Preview</h2>
            <div>
              <button
                className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
                title="Copy"
                onClick={writeClipboard}
              >
                <DocumentDuplicateIcon className="w-6 h-6" />
                Copy
              </button>
            </div>
          </div>
          <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="bg-white h-full rounded-md dark:bg-slate-700">
              <div className="prose dark:prose-invert mx-auto">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkdownPreviewPage;

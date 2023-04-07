'use client';

import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { micromark } from 'micromark';
import SelectSetting from '@/components/SelectSetting';
import CopyBar from '@/components/CopyBar';
import { useTheme } from '@/components/ThemeProvider';

type Editor = Parameters<OnMount>[0];

const options = ['light', 'dark'];

function MarkdownPreviewPage() {
  const [theme, setTheme] = useState(options[0]);
  const editorRef = useRef<Editor>(null);
  const [output, setOutput] = useState('');
  const { theme: globalTheme } = useTheme();

  const handleEditorMount = (editor: Editor) => {
    editor.updateOptions({ minimap: { enabled: false } });
    editorRef.current = editor;
  };

  return (
    <div className="flex flex-col space-y-5 h-full">
      <h1 className="text-3xl">Markdown Preview</h1>

      <div>
        <h2>Configuration</h2>
        <SelectSetting
          Icon={SwatchIcon}
          value={theme}
          onChange={(value) => setTheme(value)}
          title="Theme"
          subTitle="Select which theme to use to preview the Markdown"
          options={options}
          optionValueFormatter={(option) =>
            option[0].toUpperCase() + option.slice(1)
          }
        />
      </div>

      <div className="flex gap-5 flex-1">
        <div className="flex-1 flex flex-col">
          <PasteLoadClearBar
            title="Markdown"
            onValueChange={(value) => editorRef.current.setValue(value)}
          />
          <div className="flex-1">
            <Editor
              theme={globalTheme === 'dark' ? 'vs-dark' : 'light'}
              onChange={(value) => {
                setOutput(value ?? '');
              }}
              onMount={handleEditorMount}
            />
          </div>
        </div>
        <div className="flex-1">
          <CopyBar title="Preview" getNeedCopyText={() => micromark(output)} />
          <div className={theme === 'dark' ? 'dark' : 'light'}>
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

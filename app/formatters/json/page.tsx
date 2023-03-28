'use client';

import {
  Bars3BottomRightIcon,
  ArrowsUpDownIcon,
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import Editor, { OnMount } from '@monaco-editor/react';

const options = ['2 spaces', '4 spaces', '1 tab', 'Minified'];

type Editor = Parameters<OnMount>[0];

function JsonPage() {
  const [indentation, setIndentation] = useState(options[0]);
  const [isSort, setIsSort] = useState(false);
  const editorRef = useRef<Editor>(null);
  const outputEditorRef = useRef<Editor>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      handleEditorChange(editorRef.current.getValue());
    }
  }, [indentation, isSort]);

  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(outputEditorRef.current.getValue());
    }
  };

  const clearInput = () => {
    editorRef.current.setValue('');
  };

  const readClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        editorRef.current.setValue(text);
      });
    }
  };

  const chooseFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const onChangeFile = () => {
    if (inputFileRef.current && inputFileRef.current.files) {
      const file = inputFileRef.current.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const fileContent = reader.result as string;
        editorRef.current.setValue(fileContent);
      });

      reader.readAsText(file);

      inputFileRef.current.value = '';
    }
  };

  const handleInputEditorMount = (editor: Editor) => {
    editor.updateOptions({ minimap: { enabled: false } });
    editorRef.current = editor;
  };

  const handleOutputEditorMount = (editor: Editor) => {
    editor.updateOptions({ minimap: { enabled: false }, readOnly: true });
    outputEditorRef.current = editor;
  };

  const getIndentaiorFromText = () => {
    switch (indentation) {
      case '2 spaces':
        return '  ';
      case '4 spaces':
        return '    ';
      case '1 tab':
        return '\t';
      case 'Minified':
        return 0;
      default:
        return '    ';
    }
  };

  const sortObjRecursion = (jsonObj: Record<string, any>) => {
    const sortedObj: Record<string, any> = {};
    Object.keys(jsonObj)
      .sort()
      .forEach((key) => {
        if (typeof jsonObj[key] === 'object' && !Array.isArray(jsonObj[key])) {
          sortedObj[key] = sortObjRecursion(jsonObj[key]);
        } else {
          sortedObj[key] = jsonObj[key];
        }
      });
    return sortedObj;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      outputEditorRef.current.setValue('');
      return;
    }
    try {
      const json = JSON.parse(value || '');
      const sortedJson = isSort ? sortObjRecursion(json) : json;
      outputEditorRef.current.setValue(
        JSON.stringify(sortedJson, null, getIndentaiorFromText())
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-full flex flex-col gap-5">
      <h1 className="text-3xl">JSON Formatter</h1>
      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <Bars3BottomRightIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">Indentation</span>
            <div className="px-3 py-2 shadow border rounded-md">
              <select
                value={indentation}
                onChange={(e) => setIndentation(e.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <ArrowsUpDownIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">Sort JSON properties alphabetically</span>
            <div>{isSort ? 'On' : 'Off'}</div>
            <div>
              <Switch
                checked={isSort}
                onChange={(checked) => {
                  setIsSort(checked);
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#0369A1"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-5 flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-baseline mb-3">
            <h2>Input</h2>
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
                onClick={clearInput}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-md border shadow flex-1">
            <Editor
              defaultLanguage="json"
              onMount={handleInputEditorMount}
              onChange={handleEditorChange}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-baseline mb-3">
            <h2>Output</h2>
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
          <div className="bg-white rounded-md border shadow flex-1">
            <Editor defaultLanguage="json" onMount={handleOutputEditorMount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonPage;

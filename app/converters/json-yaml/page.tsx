'use client';

import {
  Bars3BottomRightIcon,
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import jsyaml from 'js-yaml';

const options = ['2 spaces', '4 spaces'];
const modeOptions = ['JSON to YAML', 'YAML to JSON'];

type Editor = Parameters<OnMount>[0];

function JsonYamlPage() {
  const [indentation, setIndentation] = useState(options[0]);
  const [mode, setMode] = useState(modeOptions[0]);
  const editorRef = useRef<Editor>(null);
  const outputEditorRef = useRef<Editor>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && outputEditorRef.current) {
      const inputEditorValue = editorRef.current.getValue();
      const outputEditorValue = outputEditorRef.current.getValue();
      editorRef.current.setValue(outputEditorValue);
      outputEditorRef.current.setValue(inputEditorValue);
    }
  }, [mode]);

  useEffect(() => {
    if (editorRef.current) {
      handleEditorChange(editorRef.current.getValue());
    }
  }, [indentation, mode]);

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
        return 2;
      case '4 spaces':
        return 4;
      default:
        return 4;
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      outputEditorRef.current.setValue('');
      return;
    }
    try {
      if (mode === 'JSON to YAML') {
        const yaml = jsyaml.dump(JSON.parse(value), {
          indent: getIndentaiorFromText(),
        });
        outputEditorRef.current.setValue(yaml);
      } else {
        const json = JSON.stringify(
          jsyaml.load(value),
          null,
          getIndentaiorFromText()
        );
        outputEditorRef.current.setValue(json);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-full flex flex-col gap-5">
      <h1 className="text-3xl">JSON &#x3C; &#x3E; YAML Converter</h1>
      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <ArrowsRightLeftIcon className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-lg">Conversion</span>
              <span className="text-xs">
                Select which conversion mode you want to use
              </span>
            </div>
            <div className="px-3 py-2 shadow border rounded-md">
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                {modeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
              language={mode === 'JSON to YAML' ? 'json' : 'yaml'}
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
            <Editor
              language={mode === 'JSON to YAML' ? 'yaml' : 'json'}
              onMount={handleOutputEditorMount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonYamlPage;

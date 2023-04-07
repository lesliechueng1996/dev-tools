'use client';

import {
  Bars3BottomRightIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import jsyaml from 'js-yaml';
import SelectSetting from '@/components/SelectSetting';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import CopyBar from '@/components/CopyBar';
import { useTheme } from '@/components/ThemeProvider';

const options = ['2 spaces', '4 spaces'];
const modeOptions = ['JSON to YAML', 'YAML to JSON'];

type Editor = Parameters<OnMount>[0];

function JsonYamlPage() {
  const [indentation, setIndentation] = useState(options[0]);
  const [mode, setMode] = useState(modeOptions[0]);
  const editorRef = useRef<Editor>(null);
  const outputEditorRef = useRef<Editor>(null);
  const { theme } = useTheme();

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
          <SelectSetting
            Icon={ArrowsRightLeftIcon}
            value={mode}
            onChange={(value) => setMode(value)}
            title="Conversion"
            subTitle="Select which conversion mode you want to use"
            options={modeOptions}
          />

          <SelectSetting
            Icon={Bars3BottomRightIcon}
            value={indentation}
            onChange={(value) => setIndentation(value)}
            title="Indentation"
            options={options}
          />
        </div>
      </div>
      <div className="flex gap-5 flex-1">
        <div className="flex-1 flex flex-col">
          <PasteLoadClearBar
            title="Input"
            onValueChange={(value) => editorRef.current.setValue(value)}
          />
          <div className="theme-bg theme-border flex-1">
            <Editor
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              language={mode === 'JSON to YAML' ? 'json' : 'yaml'}
              onMount={handleInputEditorMount}
              onChange={handleEditorChange}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <CopyBar
            title="Output"
            getNeedCopyText={() => outputEditorRef.current.getValue()}
          />
          <div className="theme-bg theme-border flex-1">
            <Editor
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
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

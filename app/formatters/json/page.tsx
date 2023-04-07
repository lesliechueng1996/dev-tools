'use client';

import {
  Bars3BottomRightIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import SelectSetting from '@/components/SelectSetting';
import SwitchSetting from '@/components/SwitchSetting';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import CopyBar from '@/components/CopyBar';
import { useTheme } from '@/components/ThemeProvider';

const options = ['2 spaces', '4 spaces', '1 tab', 'Minified'];

type Editor = Parameters<OnMount>[0];

function JsonPage() {
  const { theme } = useTheme();
  const [indentation, setIndentation] = useState(options[0]);
  const [isSort, setIsSort] = useState(false);
  const editorRef = useRef<Editor>(null);
  const outputEditorRef = useRef<Editor>(null);

  useEffect(() => {
    if (editorRef.current) {
      handleEditorChange(editorRef.current.getValue());
    }
  }, [indentation, isSort]);

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
          <SelectSetting
            Icon={Bars3BottomRightIcon}
            value={indentation}
            onChange={(value) => setIndentation(value)}
            title="Indentation"
            options={options}
          />
          <SwitchSetting
            Icon={ArrowsUpDownIcon}
            value={isSort}
            onChange={(checked) => setIsSort(checked)}
            title="Sort JSON properties alphabetically"
            trueValue="On"
            falseValue="Off"
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
              defaultLanguage="json"
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
              defaultLanguage="json"
              onMount={handleOutputEditorMount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonPage;

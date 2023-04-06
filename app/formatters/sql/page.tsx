'use client';

import CopyBar from '@/components/CopyBar';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import SelectSetting from '@/components/SelectSetting';
import {
  Bars3BottomRightIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import Editor, { OnMount } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { FormatOptionsWithLanguage, format } from 'sql-formatter';

const sqlOptions = [
  {
    key: 'db2',
    value: 'Db2',
  },
  {
    key: 'mariadb',
    value: 'Mariadb',
  },
  {
    key: 'mysql',
    value: 'Mysql',
  },
  {
    key: 'n1ql',
    value: 'N1QL',
  },
  {
    key: 'plsql',
    value: 'PL/SQL',
  },
  {
    key: 'postgresql',
    value: 'PostgreSQL',
  },
  {
    key: 'redshift',
    value: 'Amazon Redshift',
  },
  {
    key: 'spark',
    value: 'Spark SQL',
  },
  {
    key: 'sql',
    value: 'Standard SQL',
  },
  {
    key: 'tsql',
    value: 'Transact-SQL',
  },
];

const options = ['2 spaces', '4 spaces', '1 tab'];

type Editor = Parameters<OnMount>[0];

function SqlPage() {
  const [sqlType, setSqlType] = useState(sqlOptions[8].key);
  const [indentation, setIndentation] = useState(options[0]);

  const editorRef = useRef<Editor>(null);
  const outputEditorRef = useRef<Editor>(null);

  const getIndentaiorFromText = () => {
    switch (indentation) {
      case '2 spaces':
        return 2;
      case '4 spaces':
        return 4;
      default:
        return 2;
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

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      outputEditorRef.current.setValue('');
      return;
    }
    try {
      const option: FormatOptionsWithLanguage = {
        language: sqlType,
        useTabs: indentation === '1 tab',
        tabWidth: indentation === '1 tab' ? undefined : getIndentaiorFromText(),
      };

      const formatted = format(value, option);
      outputEditorRef.current.setValue(formatted);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      handleEditorChange(editorRef.current.getValue());
    }
  }, [sqlType, indentation]);

  return (
    <div className="space-y-5 h-full flex flex-col">
      <h1>SQL Formatter</h1>

      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <SelectSetting
            Icon={CodeBracketIcon}
            value={sqlType}
            onChange={(value) => {
              setSqlType(value);
            }}
            title="Language"
            keyValueOptions={sqlOptions}
          />

          <SelectSetting
            Icon={Bars3BottomRightIcon}
            value={indentation}
            onChange={(value) => {
              setIndentation(value);
            }}
            title="Indentation"
            options={options}
          />
        </div>
      </div>

      <div className="flex flex-1 gap-5">
        <div className="flex-1 flex flex-col">
          <PasteLoadClearBar
            title="Input"
            onValueChange={(text) => editorRef.current.setValue(text)}
          />
          <div className="bg-white rounded-md border shadow flex-1">
            <Editor
              defaultLanguage="sql"
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
          <div className="bg-white rounded-md border shadow flex-1">
            <Editor defaultLanguage="sql" onMount={handleOutputEditorMount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SqlPage;

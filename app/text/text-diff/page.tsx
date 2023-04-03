'use client';

import PasteFileEditor from '@/components/PasteFileEditor';
import { CodeBracketSquareIcon } from '@heroicons/react/24/outline';
import { DiffEditor, OnMount } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';

type DiffEditor = Parameters<OnMount>[0];

function TextDiffPage() {
  const [inlineMode, setInlineMode] = useState(false);
  const diffEditorRef = useRef<DiffEditor>(null);

  const [leftSide, setLeftSide] = useState('');
  const [rightSide, setRightSide] = useState('');

  const handleDiffEditorMount = (editor: DiffEditor) => {
    diffEditorRef.current = editor;
  };

  useEffect(() => {
    if (diffEditorRef.current) {
      diffEditorRef.current.updateOptions({ renderSideBySide: !inlineMode });
    }
  }, [inlineMode]);

  return (
    <div className="space-y-5 h-full flex flex-col mb-5">
      <h1 className="text-3xl">Text Comparer</h1>

      <div>
        <h2>Configuration</h2>
        <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
          <div>
            <CodeBracketSquareIcon className="w-6 h-6" />
          </div>
          <span className="flex-1">Inline Mode</span>
          <div>{inlineMode ? 'On' : 'Off'}</div>
          <div>
            <Switch
              checked={inlineMode}
              onChange={(checked) => {
                setInlineMode(checked);
              }}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#0369A1"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-5 flex-1">
        <PasteFileEditor
          title="Old text"
          onTextChange={(text) => setLeftSide(text)}
          className="w-1/2 flex-1 h-full"
        />
        <PasteFileEditor
          title="New text"
          onTextChange={(text) => setRightSide(text)}
          className="w-1/2 flex-1 h-full"
        />
      </div>

      <div className="flex-1">
        <h2>Difference</h2>
        <DiffEditor
          onMount={handleDiffEditorMount}
          original={leftSide}
          modified={rightSide}
        />
      </div>
    </div>
  );
}

export default TextDiffPage;

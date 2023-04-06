'use client';

import PasteFileEditor from '@/components/PasteFileEditor';
import SwitchSetting from '@/components/SwitchSetting';
import { CodeBracketSquareIcon } from '@heroicons/react/24/outline';
import { DiffEditor, OnMount } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';

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
        <SwitchSetting
          Icon={CodeBracketSquareIcon}
          value={inlineMode}
          onChange={(checked) => setInlineMode(checked)}
          title="Inline Mode"
          trueValue="On"
          falseValue="Off"
        />
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

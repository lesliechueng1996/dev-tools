import Editor, { OnMount } from '@monaco-editor/react';
import PasteLoadClearBar from './PasteLoadClearBar';
import { useRef } from 'react';
import { useTheme } from './ThemeProvider';

type Props = {
  className?: string;
  title: string;
  onTextChange: (text: string) => void;
};

type Editor = Parameters<OnMount>[0];

function PasteFileEditor({ title, onTextChange, className = '' }: Props) {
  const { theme } = useTheme();
  const editorRef = useRef<Editor>();

  const handleInputEditorMount = (editor: Editor) => {
    editor.updateOptions({ minimap: { enabled: false } });
    editorRef.current = editor;
  };

  const handleEditorChange = (text: string | undefined) => {
    onTextChange(text ?? '');
  };

  return (
    <div className={`${className} flex flex-col`}>
      <PasteLoadClearBar
        title={title}
        onValueChange={(value: string) => {
          editorRef.current?.setValue(value);
        }}
      />
      <Editor
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        className="flex-1"
        onMount={handleInputEditorMount}
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default PasteFileEditor;

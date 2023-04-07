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
function XmlPage() {
  const { theme } = useTheme();
  const [indentation, setIndentation] = useState(options[0]);
  const [needNewline, setNeedNewline] = useState(false);
  const editorRef = useRef<Editor>(null);
  const outputEditorRef = useRef<Editor>(null);

  useEffect(() => {
    if (editorRef.current) {
      handleEditorChange(editorRef.current.getValue());
    }
  }, [indentation, needNewline]);

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
        return '';
      default:
        return '    ';
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      outputEditorRef.current.setValue('');
      return;
    }

    const serializeNode = (node: HTMLElement, indent: string) => {
      let result = '';
      result += `${indent}<${node.nodeName}`;

      const attributes = node.attributes;
      if (attributes && attributes.length > 0) {
        for (let i = 0; i < attributes.length; i++) {
          const attribute = attributes[i];
          if (needNewline) {
            result += `\n${indent}${getIndentaiorFromText()}${
              attribute.name
            }="${attribute.value}"`;
          } else {
            result += ` ${attribute.name}="${attribute.value}"`;
          }
        }
      }
      result += '>';

      const children = node.childNodes;
      if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.nodeName === '#text') {
            result += child.textContent;
          } else {
            result += '\n';
            result += serializeNode(
              child as HTMLElement,
              indent + getIndentaiorFromText()
            );
            if (i === children.length - 1) {
              result += `\n${indent}`;
            }
          }
        }
      }

      result += `</${node.nodeName}>`;
      return result;
    };

    try {
      // format xml
      const parser = new DOMParser();
      const xmlDom = parser.parseFromString(value, 'text/xml');
      if (indentation === 'Minified') {
        const xmlString = new XMLSerializer().serializeToString(xmlDom);
        outputEditorRef.current.setValue(xmlString);
      } else {
        const xmlString = serializeNode(xmlDom.documentElement, '').trim();
        outputEditorRef.current.setValue(xmlString);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-full flex flex-col gap-5">
      <h1 className="text-3xl">XML Formatter</h1>
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
            value={needNewline}
            onChange={(checked) => {
              setNeedNewline(checked);
            }}
            title="Put attributes on new line"
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
              defaultLanguage="xml"
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
              defaultLanguage="xml"
              onMount={handleOutputEditorMount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default XmlPage;

import MonacoEditor from '@monaco-editor/react';
import React from 'react';
import { CodeEditorOptions } from 'components/ide/editor/CodeEditorOptions';

const CodeEditor = (props: Props) => {
  const { updateCode, language, startingCode } = props;
  return (
    <MonacoEditor
      defaultLanguage={language}
      defaultValue={startingCode}
      onChange={updateCode}
      onMount={() => console.log('mounted')}
      theme={'vs-dark'}
      options={CodeEditorOptions}
      {...props}
    />
  );
};

type Props = {
  updateCode?: (newCode?: string, _?: any) => void;
  startingCode?: string;
  language: string;
  width?: string;
  height?: string;
};

export default CodeEditor;

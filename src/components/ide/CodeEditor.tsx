import MonacoEditor from '@monaco-editor/react';
import React from 'react';

const CodeEditor = (props: Props) => {
  const { updateCode, language } = props;
  return (
    <MonacoEditor
      defaultLanguage={language}
      onChange={updateCode}
      onMount={() => console.log('mounted')}
      theme={'vs-dark'}
      options={{
        automaticLayout: true,
        fontSize: '14px',
        fontWeight: 600,
        lineNumbersMinChars: 3,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on'
      }}
      {...props}
    />
  );
};

type Props = {
  updateCode: (newCode?: string, _?: any) => void;
  language: string;
  width?: string;
  height?: string;
};

export default CodeEditor;

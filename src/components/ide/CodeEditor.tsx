import MonacoEditor from '@monaco-editor/react';
import React from 'react';

const CodeEditor = (props: Props) => {
  const { updateCode } = props;
  return (
    <MonacoEditor
      defaultLanguage="javascript"
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
      width="50%"
      height="100%"
    />
  );
};

type Props = {
  updateCode: (newCode?: string, _?: any) => void;
};

export default CodeEditor;

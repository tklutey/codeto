import React, { ReactElement, useCallback, useRef } from 'react';
import Layout from 'layout';
import MonacoEditor from '@monaco-editor/react';

const Practice = () => {
  const previewRef = useRef<any>(null);
  const entryFileValueRef = useRef<string | undefined>();

  const handleRunCode = () => {
    previewRef.current?.getElementsByTagName('iframe')[0].contentWindow?.postMessage(
      {
        code: entryFileValueRef.current,
        event: 'runCode'
      },
      '*'
    );
  };

  const updateCode = (newCode?: string, _?: any) => {
    entryFileValueRef.current = newCode;
  };

  return (
    <div ref={previewRef} style={{ height: '100%', display: 'flex' }}>
      <MonacoEditor
        defaultLanguage="python"
        loading={<div className="flex justify-center items-center w-full h-full font-bold text-white bg-bg-primary">Loading...</div>}
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
      <iframe style={{ width: 'width%', height: '100%' }} src={`https://riju.codeamigo.xyz/python`} />
      <button onClick={handleRunCode}>Run</button>
    </div>
  );
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

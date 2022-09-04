import React, { ReactElement, useRef } from 'react';
import Layout from 'layout';
import MonacoEditor from '@monaco-editor/react';
import { Button } from '@mui/material';

const Practice = () => {
  const previewRef = useRef<any>(null);
  const entryFileValueRef = useRef<string | undefined>();

  const handleRunCode = () => {
    const rijuIframe = previewRef.current.getElementsByTagName('iframe')[0];
    rijuIframe.contentWindow?.postMessage(
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button onClick={handleRunCode} style={{ height: '10%' }}>
        Run Code
      </Button>
      <div ref={previewRef} style={{ height: '90%', width: '100%', display: 'flex' }}>
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
        <iframe style={{ width: '50%', height: '100%' }} src={`https://riju.codeamigo.xyz/python`} />
      </div>
    </div>
  );
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

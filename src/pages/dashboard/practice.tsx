import React, { ReactElement, useCallback } from 'react';
import Layout from 'layout';
import MonacoEditor from '@monaco-editor/react';

const Practice = () => {
  return (
    <div style={{ height: '100%', display: 'flex' }}>
      <MonacoEditor
        defaultLanguage="typescript"
        loading={<div className="flex justify-center items-center w-full h-full font-bold text-white bg-bg-primary">Loading...</div>}
        onChange={() => console.log('changed')}
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
      <iframe style={{ width: 'width%', height: '100%' }} src={`https://riju.codeamigo.xyz/java`} />
    </div>
  );
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

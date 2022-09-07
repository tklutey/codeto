import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CodeEditor from 'components/ide/CodeEditor';
import CodeExecutionTerminal from 'components/ide/CodeExecutionTerminal';
import Tests from 'components/ide/Tests';

const IDE = (props: Props) => {
  const { width, height, language } = props;
  const terminalRef = useRef<any>();
  const entryFileValueRef = useRef<string | undefined>();

  const handleRunCode = () => {
    if (terminalRef.current) {
      terminalRef.current.runCode();
    }
  };

  const handleTestCode = () => {
    if (terminalRef.current) {
      terminalRef.current.testCode();
    }
  };

  const updateCode = (newCode?: string, _?: any) => {
    entryFileValueRef.current = newCode;
  };

  return (
    <div style={{ height: height, width: width, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button variant="contained" onClick={handleRunCode} style={{ height: '5%', marginBottom: '10px' }}>
        Run Code
      </Button>
      <div style={{ height: '90%', width: '100%', display: 'flex' }}>
        <CodeEditor language={language} updateCode={updateCode} width={'50%'} height={'100%'} />
        <div style={{ height: '90%', width: '50%', display: 'flex', flexDirection: 'column' }}>
          <CodeExecutionTerminal ref={terminalRef} language={language} codeRef={entryFileValueRef} width={'100%'} height={'60%'} />
          <Tests handleRunTests={handleTestCode} />
        </div>
      </div>
    </div>
  );
};

type Props = {
  language: string;
  height?: string;
  width?: string;
};
export default IDE;

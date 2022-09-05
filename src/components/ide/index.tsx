import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CodeEditor from 'components/ide/CodeEditor';
import CodeExecutionTerminal from 'components/ide/CodeExecutionTerminal';

const IDE = (props: Props) => {
  const { width, height } = props;
  const terminalRef = useRef<any>();
  const entryFileValueRef = useRef<string | undefined>();

  const handleRunCode = () => {
    if (terminalRef.current) {
      terminalRef.current.runCode();
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
        <CodeEditor updateCode={updateCode} width={'50%'} height={'100%'} />
        <CodeExecutionTerminal ref={terminalRef} codeRef={entryFileValueRef} width={'50%'} height={'100%'} />
      </div>
    </div>
  );
};

type Props = {
  height?: string;
  width?: string;
};
export default IDE;

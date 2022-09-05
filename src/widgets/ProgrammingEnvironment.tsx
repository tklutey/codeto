import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CodeEditor from 'components/ide/CodeEditor';
import CodeExecutionTerminal from 'components/ide/CodeExecutionTerminal';

const ProgrammingEnvironment = () => {
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button onClick={handleRunCode} style={{ height: '10%' }}>
        Run Code
      </Button>
      <div style={{ height: '90%', width: '100%', display: 'flex' }}>
        <CodeEditor updateCode={updateCode} />
        <CodeExecutionTerminal ref={terminalRef} codeRef={entryFileValueRef} />
      </div>
    </div>
  );
};

export default ProgrammingEnvironment;

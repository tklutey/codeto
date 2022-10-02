import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CodeEditor from 'components/ide/CodeEditor';
// import CodeExecutionTerminal from 'components/ide/CodeExecutionTerminal';
import dynamic from 'next/dynamic';
const CodeExecutionTerminal = dynamic(() => import('components/ide/CodeExecutionTerminal'), {
  ssr: false
});
import Tests from 'components/ide/Tests';
import { trpc } from 'utils/trpc';

const IDE = (props: Props) => {
  const { width, height, language, startingCode, expectedOutput } = props;
  const codeRef = useRef<string | undefined>(startingCode);
  const mutation = trpc.useMutation('executeCode.post');
  const [terminalText, setTerminalText] = React.useState<string>('Awaiting...');

  const handleRunCode = () => {
    if (codeRef.current) {
      setTerminalText('Running...');
      const input = {
        script: codeRef.current,
        language: language,
        doMock: true
      };
      mutation.mutate(input);
      if (mutation.isSuccess) {
        const output = mutation.data.output;
        if (output) {
          setTerminalText(output);
        }
      }
    }
  };

  const handleTestCode = () => {
    console.log('not yet implemented');
  };

  const updateCode = (newCode?: string, _?: any) => {
    codeRef.current = newCode;
  };

  return (
    <div style={{ height: height, width: width, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button variant="contained" onClick={handleRunCode} style={{ height: '5%', marginBottom: '10px' }}>
        Run Code
      </Button>
      <div style={{ height: '90%', width: '100%', display: 'flex' }}>
        <CodeEditor language={language} updateCode={updateCode} width={'50%'} height={'100%'} startingCode={startingCode} />
        <div style={{ height: '90%', width: '50%', display: 'flex', flexDirection: 'column' }}>
          <CodeExecutionTerminal terminalText={terminalText} width={'100%'} height={'60%'} expectedOutput={expectedOutput} />
          <Tests handleRunTests={handleTestCode} />
        </div>
      </div>
    </div>
  );
};

type Props = {
  language: string;
  expectedOutput: string;
  startingCode?: string;
  height?: string;
  width?: string;
};
export default IDE;

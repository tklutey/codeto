import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CodeEditor from 'components/ide/CodeEditor';
// import CodeExecutionTerminal from 'components/ide/CodeExecutionTerminal';
import dynamic from 'next/dynamic';
import Tests from 'components/ide/Tests';
import { trpc } from 'utils/trpc';
import { ExerciseTests } from 'server/routers/lesson';

const CodeExecutionTerminal = dynamic(() => import('components/ide/CodeExecutionTerminal'), {
  ssr: false
});

export type TestResult = {
  status: 'pass' | 'fail' | 'running';
  message: string;
};
const IDE = (props: Props) => {
  const { width, height, language, startingCode, expectedOutput, tests } = props;
  const codeRef = useRef<string | undefined>(startingCode);
  const mutation = trpc.useMutation('executeCode.post');
  const [terminalText, setTerminalText] = React.useState<string>('');

  const handleRunCode = () => {
    setTerminalText('Running...');
    if (codeRef.current) {
      const input = {
        script: codeRef.current,
        language: language,
        doMock: false
      };
      mutation.mutate(input, {
        onSuccess: (data) => {
          const output = data.output;
          if (output) {
            setTerminalText(output);
          }
        }
      });
    }
  };

  const handleTestCode = (): TestResult[] => {
    const stdOut = 'Hello, World';
    if (tests?.expectedOutput) {
      const testResults: TestResult[] = tests.expectedOutput.map((test) => {
        const status = test.matchRegex.match(stdOut) ? 'pass' : 'fail';
        return { status: status, message: test.summary };
      });
      return testResults;
    }
    return [
      {
        status: 'pass',
        message: 'No tests found'
      }
    ];
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
  tests?: ExerciseTests;
};
export default IDE;

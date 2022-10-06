import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CodeEditor from 'components/ide/CodeEditor';
import dynamic from 'next/dynamic';
import Tests from 'components/ide/Tests';
import { trpc } from 'utils/trpc';
import { ExerciseTests, TestInstance } from 'server/routers/codingProblem';

const CodeExecutionTerminal = dynamic(() => import('components/ide/CodeExecutionTerminal'), {
  ssr: false
});

export type TestResult = {
  status: 'pass' | 'fail' | 'running';
  message: string;
};
const IDE = (props: Props) => {
  const { width, height, language, startingCode, tests } = props;
  const codeRef = useRef<string | undefined>(startingCode);
  const mutation = trpc.useMutation('executeCode.post');
  const [terminalText, setTerminalText] = React.useState<string>('');

  const executeCode = (onSuccess?: (output: string) => void) => {
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
            if (onSuccess) {
              onSuccess(output);
            }
          }
        }
      });
    }
  };

  const runTestSuite = (testSuite: TestInstance[], stringToMatch: string): TestResult[] => {
    return testSuite.map((test) => {
      const status = stringToMatch.match(test.matchRegex) ? 'pass' : 'fail';
      return { status: status, message: test.summary };
    });
  };

  const runAndPush = (testResults: TestResult[], testSuite: TestInstance[], stringToMatch: string) => {
    const expectedOutputTestResults: TestResult[] = runTestSuite(testSuite, stringToMatch);
    testResults.push(...expectedOutputTestResults);
  };

  const handleTestCode = (): TestResult[] => {
    const testResults: TestResult[] = [];
    if (tests?.expectedOutput) {
      executeCode((output) => {
        runAndPush(testResults, tests.expectedOutput, output);
      });
    }
    if (tests?.expectedSourceCode) {
      runAndPush(testResults, tests.expectedSourceCode, codeRef.current || '');
    }
    if (testResults.length > 0) {
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
      <Button variant="contained" onClick={() => executeCode()} style={{ height: '5%', marginBottom: '10px' }}>
        Run Code
      </Button>
      <div style={{ height: '90%', width: '100%', display: 'flex' }}>
        <CodeEditor language={language} updateCode={updateCode} width={'50%'} height={'100%'} startingCode={startingCode} />
        <div style={{ height: '90%', width: '50%', display: 'flex', flexDirection: 'column' }}>
          <CodeExecutionTerminal terminalText={terminalText} width={'100%'} height={'60%'} />
          <Tests handleRunTests={handleTestCode} />
        </div>
      </div>
    </div>
  );
};

type Props = {
  language: string;
  startingCode?: string;
  height?: string;
  width?: string;
  tests?: ExerciseTests;
};
export default IDE;

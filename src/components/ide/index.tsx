import React, { useRef, useState } from 'react';
import CodeEditor from 'components/ide/CodeEditor';
import dynamic from 'next/dynamic';
import Tests from 'components/ide/Tests';
import { trpc } from 'utils/trpc';
import { ExerciseTests, TestInstance } from 'server/routers/codingProblem';
import RunButton from 'components/ide/RunButton';

const CodeExecutionTerminal = dynamic(() => import('components/ide/CodeExecutionTerminal'), {
  ssr: false
});

export type TestResult = {
  status: 'pass' | 'fail' | 'running';
  message: string;
};
const IDE = (props: Props) => {
  const { width, height, language, startingCode, tests, setIsProblemComplete } = props;
  const codeRef = useRef<string | undefined>(startingCode);
  const mutation = trpc.useMutation('executeCode.post');
  const [terminalText, setTerminalText] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const executeCode = async (onSuccess?: (output: string) => void) => {
    setIsExecuting(true);
    setTerminalText('Running...');
    if (codeRef.current) {
      const input = {
        script: codeRef.current,
        language: language,
        doMock: false
      };
      const data = await mutation.mutateAsync(input);
      setIsExecuting(false);

      const output = data.output;
      if (output !== undefined) {
        setTerminalText(output);
        if (onSuccess) {
          onSuccess(output);
        }
      }
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

  const allTestsPassed = (testResults: TestResult[]) => {
    return testResults.every((result) => result.status === 'pass');
  };

  const handleTestCode = async (): Promise<TestResult[]> => {
    const testResults: TestResult[] = [];
    if (tests?.expectedSourceCode) {
      runAndPush(testResults, tests.expectedSourceCode, codeRef.current || '');
    }
    await executeCode((output) => {
      if (tests?.expectedOutput) {
        runAndPush(testResults, tests.expectedOutput, output);
      }
      const status = output.match('error') ? 'fail' : 'pass';
      testResults.push({ status: status, message: 'The test runs without any errors.' });
    });
    if (allTestsPassed(testResults)) {
      setIsProblemComplete(true);
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
    <div
      style={{
        height: height,
        width: width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'clip'
      }}
    >
      <div style={{ height: '100%', width: '100%', display: 'flex', position: 'relative' }}>
        <CodeEditor
          key={startingCode}
          language={language}
          updateCode={updateCode}
          width={'50%'}
          height={'100%'}
          startingCode={startingCode}
        />
        <RunButton run={executeCode} isExecuting={isExecuting} />
        <div style={{ height: '100%', width: '50%', display: 'flex', flexDirection: 'column' }}>
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
  setIsProblemComplete: (isComplete: boolean) => void;
};
export default IDE;

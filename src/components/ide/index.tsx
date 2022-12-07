import React, { useEffect, useState } from 'react';
import CodeEditor from 'components/ide/editor/CodeEditor';
import dynamic from 'next/dynamic';
import Tests from 'components/ide/Tests';
import { trpc } from 'utils/trpc';
import { CodingProblemTest } from 'server/routers/codingProblem';
import RunButton from 'components/ide/RunButton';

const CodeExecutionTerminal = dynamic(() => import('components/ide/CodeExecutionTerminal'), {
  ssr: false
});

export type TestResult = {
  status: 'pass' | 'fail' | 'running';
  message: string;
};
const IDE = (props: Props) => {
  const {
    width,
    height,
    language,
    startingCode,
    tests,
    setIsProblemComplete,
    userCode,
    setUserCode,
    registerResetEventHandler,
    onTerminalTextChange
  } = props;
  const mutation = trpc.useMutation('executeCode.post');
  const [terminalText, setTerminalText] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  useEffect(
    () => {
      if (registerResetEventHandler) {
        registerResetEventHandler(() => setTerminalText(''));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const executeCode = async (onSuccess?: (output: string) => void) => {
    setIsExecuting(true);
    setTerminalText('Running...');
    if (userCode) {
      const input = {
        script: userCode,
        language: language,
        doMock: false
      };
      const data = await mutation.mutateAsync(input);
      setIsExecuting(false);

      const output = data.output;
      if (output !== undefined) {
        setTerminalText(output);
        if (onTerminalTextChange) {
          onTerminalTextChange(output);
        }
        if (onSuccess) {
          onSuccess(output);
        }
      }
    }
  };

  const runTestSuite = (testSuite: CodingProblemTest[], stringToMatch: string): TestResult[] => {
    return testSuite.map((test) => {
      if (test.test_type === 'regex') {
        const status = stringToMatch.match(test.test_code) ? 'pass' : 'fail';
        return { status: status, message: test.test_message };
      } else {
        return { status: 'fail', message: 'Unknown test type' };
      }
    });
  };

  const runAndPush = (testResults: TestResult[], testSuite: CodingProblemTest[], stringToMatch: string) => {
    const expectedOutputTestResults: TestResult[] = runTestSuite(testSuite, stringToMatch);
    testResults.push(...expectedOutputTestResults);
  };

  const allTestsPassed = (testResults: TestResult[]) => {
    return testResults.every((result) => result.status === 'pass');
  };

  const handleTestCode = async (): Promise<TestResult[]> => {
    const testResults: TestResult[] = [];
    const stdInTests = tests?.filter((test) => test.source_type === 'stdin');
    const stdOutTests = tests?.filter((test) => test.source_type === 'stdout');
    if (stdInTests && stdInTests.length > 0) {
      runAndPush(testResults, stdInTests, userCode || '');
    }
    await executeCode((output) => {
      if (stdOutTests && stdOutTests.length > 0) {
        runAndPush(testResults, stdOutTests, output);
      }
      const status = output.match('error') ? 'fail' : 'pass';
      testResults.push({ status: status, message: 'The test runs without any errors.' });
    });
    if (allTestsPassed(testResults) && setIsProblemComplete) {
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
    setUserCode(newCode as string);
  };

  const terminalHeight = tests ? '60%' : '100%';
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
        <CodeEditor key={startingCode} language={language} updateCode={updateCode} width={'50%'} height={'100%'} startingCode={userCode} />
        <RunButton run={executeCode} isExecuting={isExecuting} isTerminalFullHeight={!tests} />
        <div style={{ height: '100%', width: '50%', display: 'flex', flexDirection: 'column' }}>
          <CodeExecutionTerminal terminalText={terminalText} width={'100%'} height={terminalHeight} />
          {tests && <Tests handleRunTests={handleTestCode} registerResetEventHandler={registerResetEventHandler} />}
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
  tests?: CodingProblemTest[];
  setIsProblemComplete?: (isComplete: boolean) => void;
  userCode?: string;
  setUserCode: (code: string) => void;
  registerResetEventHandler?: (handler: () => void) => void;
  onTerminalTextChange?: (terminalText: string) => void;
};
export default IDE;

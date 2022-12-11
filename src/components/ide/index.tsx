import React, { useEffect, useState } from 'react';
import CodeEditor from 'components/ide/editor/CodeEditor';
import dynamic from 'next/dynamic';
import Tests from 'components/ide/Tests';
import { trpc } from 'utils/trpc';
import { CodingProblemTest } from 'server/routers/codingProblem';
import RunButton from 'components/ide/RunButton';
import useTestRunner from 'hooks/useTestRunner';

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
  const [terminalError, setTerminalError] = useState<string>('');
  const [terminalHint, setTerminalHint] = useState<string>('');
  const [isTerminalHintOpen, setIsTerminalHintOpen] = useState<boolean>(false);
  const [terminalText, setTerminalText] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const mutation = trpc.useMutation('executeCode.post');
  const { refetch: refetchErrorHint } = trpc.useQuery(
    [
      'gpt.errorHint',
      JSON.stringify({
        error: terminalError
      })
    ],
    {
      enabled: false,
      onSuccess: (data) => {
        setTerminalHint(data);
        setIsTerminalHintOpen(true);
      }
    }
  );
  console.log(terminalHint);

  const handleCodeError = (output: string) => {
    // Check if output contains "error"
    if (output.toLowerCase().includes('error')) {
      setTerminalError(output);
      refetchErrorHint();
    } else {
      setTerminalError('');
      setTerminalHint('');
    }
  };
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
        handleCodeError(output);
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

  const onAllTestsPass = () => {
    return setIsProblemComplete ? setIsProblemComplete(true) : () => {};
  };
  const { suites, resetTestSuites, handleTestCode } = useTestRunner(
    tests as CodingProblemTest[],
    userCode || '',
    onAllTestsPass,
    executeCode
  );

  useEffect(
    () => {
      if (registerResetEventHandler) {
        registerResetEventHandler(() => setTerminalText(''));
        console.log('registering test event handler');
        registerResetEventHandler(resetTestSuites);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
          <CodeExecutionTerminal
            terminalText={terminalText}
            width={'100%'}
            height={terminalHeight}
            errorHintText={terminalHint}
            setAlertOpen={setIsTerminalHintOpen}
            isAlertOpen={isTerminalHintOpen}
          />
          {tests && <Tests suites={suites} handleRunTests={handleTestCode} />}
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

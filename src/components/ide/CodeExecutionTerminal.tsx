import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const CodeExecutionTerminal = forwardRef((props: Props, ref) => {
  const { codeRef, width, height, language, expectedOutput } = props;
  const terminalRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    runCode() {
      if (terminalRef.current) {
        terminalRef.current.contentWindow?.postMessage(
          {
            code: codeRef.current,
            event: 'runCode'
          },
          '*'
        );
      }
    },
    testCode() {
      if (terminalRef.current) {
        terminalRef.current.contentWindow?.postMessage(
          {
            code: codeRef.current,
            event: 'testCode',
            expectedOutput: expectedOutput
          },
          '*'
        );
      }
    }
  }));

  return <iframe ref={terminalRef} style={{ width: width, height: height }} src={`https://riju.codeamigo.xyz/${language}`} />;
});

type Props = {
  codeRef: any;
  expectedOutput: string;
  language: string;
  width?: string;
  height?: string;
};

export default CodeExecutionTerminal;

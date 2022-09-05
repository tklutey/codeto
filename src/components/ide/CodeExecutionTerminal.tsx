import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const CodeExecutionTerminal = forwardRef((props: Props, ref) => {
  const { codeRef, width, height } = props;
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
    }
  }));
  return <iframe ref={terminalRef} style={{ width: width, height: height }} src={`https://riju.codeamigo.xyz/python`} />;
});

type Props = {
  codeRef: any;
  width?: string;
  height?: string;
};

export default CodeExecutionTerminal;

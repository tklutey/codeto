import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const CodeExecutionTerminal = forwardRef((props: Props, ref) => {
  const { codeRef } = props;
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
  return <iframe ref={terminalRef} style={{ width: '50%', height: '100%' }} src={`https://riju.codeamigo.xyz/python`} />;
});

type Props = {
  codeRef: any;
};

export default CodeExecutionTerminal;

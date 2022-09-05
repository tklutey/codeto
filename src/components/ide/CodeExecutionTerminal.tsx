import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const CodeExecutionTerminal = forwardRef((props: Props, ref) => {
  const { codeRef, width, height, language } = props;
  const terminalRef = useRef<any>();
  useImperativeHandle(ref, () => ({
    runCode() {
      console.log('runCode');
      if (terminalRef.current) {
        console.log(terminalRef.current);
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
  return <iframe ref={terminalRef} style={{ width: width, height: height }} src={`https://riju.codeamigo.xyz/${language}`} />;
});

type Props = {
  codeRef: any;
  language: string;
  width?: string;
  height?: string;
};

export default CodeExecutionTerminal;

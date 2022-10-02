import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';

const CodeExecutionTerminal = (props: Props) => {
  const { width, height, expectedOutput, terminalText } = props;
  const term = useRef<Terminal>();
  useEffect(() => {
    term.current = new Terminal();
    // @ts-ignore
    term.current.open(document.getElementById('terminal'));
  }, []);

  useEffect(() => {
    if (term.current && terminalText) {
      term.current.clear();
      term.current.writeln(terminalText, () => console.log('wrote ' + terminalText));
    }
  }, [terminalText]);

  return (
    <div>
      <div id="terminal" style={{ width: width, height: height }}></div>
    </div>
  );
};

type Props = {
  expectedOutput: string;
  width?: string;
  height?: string;
  terminalText?: string;
};

export default CodeExecutionTerminal;

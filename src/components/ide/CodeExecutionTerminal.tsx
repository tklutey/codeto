import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const CodeExecutionTerminal = (props: Props) => {
  const { width, height, expectedOutput, terminalText } = props;
  const term = useRef<Terminal>();
  useEffect(() => {
    term.current = new Terminal();
    const fitAddon = new FitAddon();
    term.current.loadAddon(fitAddon);
    // @ts-ignore
    term.current.open(document.getElementById('terminal'));
    fitAddon.fit();
  }, []);

  useEffect(() => {
    if (term.current && terminalText) {
      term.current.clear();
      term.current.write(terminalText, () => console.log('wrote ' + terminalText));
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

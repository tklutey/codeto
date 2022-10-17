import React, { useEffect, useRef } from 'react';
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const CodeExecutionTerminal = (props: Props) => {
  const { width, height, terminalText } = props;
  const term = useRef<Terminal>();
  useEffect(() => {
    term.current = new Terminal({ convertEol: true });
    const fitAddon = new FitAddon();
    term.current.loadAddon(fitAddon);
    // @ts-ignore
    term.current.open(document.getElementById('terminal'));
    fitAddon.fit();
  }, []);

  useEffect(() => {
    if (term.current && terminalText) {
      term.current.reset();
      term.current.write(terminalText, () => console.log('wrote ' + terminalText));
      term.current.focus();
    }
  }, [terminalText]);

  return (
    <div style={{ width: width, height: height }}>
      <div id="terminal" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

type Props = {
  width?: string;
  height?: string;
  terminalText?: string;
};

export default CodeExecutionTerminal;

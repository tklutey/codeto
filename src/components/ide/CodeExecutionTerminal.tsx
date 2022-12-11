import React, { useEffect, useRef } from 'react';
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Alert, Typography } from '@mui/material';

const CodeExecutionTerminal = ({ width, height, terminalText, errorHintText, isAlertOpen, setAlertOpen }: Props) => {
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
    if (term.current && terminalText !== undefined && terminalText !== null) {
      term.current.reset();
      term.current.write(terminalText);
      term.current.focus();
    }
  }, [terminalText]);

  return (
    <div
      style={{
        width: width,
        height: height,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div id="terminal" style={{ width: '100%', height: '100%' }}></div>
      {isAlertOpen && (
        <Alert
          severity="info"
          sx={{
            minHeight: '30px',
            maxHeight: '100px',
            width: '95%',
            overflowY: 'scroll',
            zIndex: 100,
            position: 'absolute',
            bottom: 20
          }}
          onClose={() => setAlertOpen(false)}
        >
          <Typography variant="body2" sx={{ overflowWrap: 'break-word' }}>
            {errorHintText}
          </Typography>
        </Alert>
      )}
    </div>
  );
};

type Props = {
  width?: string;
  height?: string;
  terminalText?: string;
  errorHintText?: string;
  isAlertOpen?: boolean;
  setAlertOpen: (isOpen: boolean) => void;
};

export default CodeExecutionTerminal;

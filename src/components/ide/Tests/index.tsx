import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { TestResult } from 'components/ide/index';

const Tests = (props: Props) => {
  const { handleRunTests, registerResetEventHandler } = props;
  const [suites, setSuites] = useState<TestResult[]>();

  const doRunTests = async () => {
    setSuites(await handleRunTests());
  };

  useEffect(
    () => {
      if (registerResetEventHandler) {
        console.log('registering test event handler');
        registerResetEventHandler(() => setSuites([]));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Test Summary</h2>
          <Button variant="contained" onClick={doRunTests} style={{ height: '35px', marginTop: '5px' }}>
            Run Tests
          </Button>
        </div>
      </div>
      <div>
        {suites?.map((suite, i) => (
          <div key={i}>
            <div>
              {suite.status === 'pass' ? <>✅</> : <>❌</>} {suite.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type Props = {
  handleRunTests: () => Promise<TestResult[]>;
  registerResetEventHandler?: (handler: () => void) => void;
};

export default Tests;

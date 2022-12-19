import { Button } from '@mui/material';
import { TestResult } from 'components/ide/index';
import { useEffect, useState } from 'react';

const Tests = ({ handleRunTests, suites, testLimit, areAllTestsPassed, onTestLimitExceeded, registerResetEventHandler }: Props) => {
  const [numTestRuns, setNumTestRuns] = useState<number>(0);
  const doRunTests = async () => {
    await handleRunTests();
    if (testLimit) {
      setNumTestRuns((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (testLimit && numTestRuns >= testLimit && !areAllTestsPassed && onTestLimitExceeded) {
      onTestLimitExceeded();
    }
  }, [numTestRuns, areAllTestsPassed, onTestLimitExceeded, testLimit]);

  useEffect(
    () => {
      registerResetEventHandler(() => setNumTestRuns(0));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const testButtonText = testLimit ? `Run Tests (${numTestRuns} / ${testLimit})` : 'Run Tests';

  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Test Summary</h2>
          <Button variant="contained" onClick={doRunTests} style={{ height: '35px', marginTop: '5px' }}>
            {testButtonText}
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
  suites: TestResult[] | undefined;
  handleRunTests: () => Promise<void>;
  areAllTestsPassed: boolean;
  testLimit?: number;
  onTestLimitExceeded?: () => void;
  registerResetEventHandler: (handler: () => void) => void;
};

export default Tests;

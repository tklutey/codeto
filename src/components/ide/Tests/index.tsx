import { Button } from '@mui/material';
import { TestResult } from 'components/ide/index';
import { useEffect, useState } from 'react';

const Tests = ({ handleRunTests, suites, testLimit }: Props) => {
  const [numTestRuns, setNumTestRuns] = useState<number>(0);
  const doRunTests = async () => {
    if (testLimit) {
      setNumTestRuns((prev) => prev + 1);
    }
    await handleRunTests();
  };

  useEffect(() => {
    if (testLimit && numTestRuns >= testLimit) {
      console.log('ya done goofed');
    }
  }, [numTestRuns]);
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
  testLimit?: number;
};

export default Tests;

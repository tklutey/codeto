import { Box, Button, Typography } from '@mui/material';
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
    <Box px={2} py={1}>
      <Box>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h2">Test Summary</Typography>
          <Button variant="contained" onClick={doRunTests} style={{ height: '35px', marginTop: '5px' }}>
            {testButtonText}
          </Button>
        </Box>
      </Box>
      <Box>
        {suites?.map((suite, i) => (
          <Box key={i}>
            <Box>
              {suite.status === 'pass' ? <>✅</> : <>❌</>} {suite.message}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
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

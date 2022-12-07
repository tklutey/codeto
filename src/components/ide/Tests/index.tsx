import { Button } from '@mui/material';
import { TestResult } from 'components/ide/index';

const Tests = ({ handleRunTests, suites }: Props) => {
  const doRunTests = async () => {
    await handleRunTests();
  };

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
  suites: TestResult[] | undefined;
  handleRunTests: () => Promise<TestResult[]>;
};

export default Tests;

import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { CodeSandboxTestMsgType, TestDataType } from 'components/ide/Tests/types';

const Tests = (props: Props) => {
  const { handleRunTests } = props;
  const [suites, setSuites] = useState<TestDataType[]>();
  useEffect(() => {
    const handleTestResults = (msg: MessageEvent<CodeSandboxTestMsgType>) => {
      if (msg.data.event === 'test_end') {
        setSuites((curr) => {
          if (curr?.find((val) => val.name === msg.data.test.name)) return curr;

          return [...(curr || []), msg.data.test];
        });
      }
    };

    window.addEventListener('message', handleTestResults);

    return () => window.removeEventListener('message', handleTestResults);
  }, []);
  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Test Summary</h2>
          <Button variant="contained" onClick={handleRunTests} style={{ height: '35px', marginTop: '5px' }}>
            Run Tests
          </Button>
        </div>
      </div>
      <div>
        {suites?.map((suite, i) => (
          <div key={i}>
            <div>
              {suite.status === 'pass' ? <>✅</> : <>❌</>} {suite.blocks.join(' > ')} {suite.name}
            </div>
            {suite.errors.map(
              (val) =>
                val.message &&
                val.message.split('//').map((value, i) => {
                  return <div key={i}>{value}</div>;
                })
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

type Props = {
  handleRunTests: () => void;
};

export default Tests;

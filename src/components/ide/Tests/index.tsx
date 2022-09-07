import { Button } from '@mui/material';
import { useEffect } from 'react';
import { CodeSandboxTestMsgType } from 'components/ide/Tests/types';

const Tests = () => {
  useEffect(() => {
    const handleTestResults = (msg: MessageEvent<CodeSandboxTestMsgType>) => {
      console.log(msg);
      if (msg.data.event === 'test_end') {
        console.log(msg.data.test);
      }
    };

    window.addEventListener('message', handleTestResults);

    return () => window.removeEventListener('message', handleTestResults);
  }, []);
  const handleRunTests = () => console.log('tests');
  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Test Summary</h2>
          <Button variant="contained" onClick={handleRunTests}>
            Run Tests
          </Button>
        </div>
      </div>
      <div className="p-4">
        {/*{suites?.map((suite, i) => (*/}
        {/*  <div className="mb-4" key={i}>*/}
        {/*    <div className={`text-md font-bold ${suite.status === 'fail' ? 'text-red-400' : 'text-green-500'}`}>*/}
        {/*      {suite.status === 'pass' ? <>✅</> : null} {suite.blocks.join(' > ')} {'> ' + suite.name}*/}
        {/*    </div>*/}
        {/*    {suite.errors.map(*/}
        {/*      (val) =>*/}
        {/*        val.message &&*/}
        {/*        val.message.split('//').map((value, i) => {*/}
        {/*          return (*/}
        {/*            <div className="mb-1 text-text-primary" key={i}>*/}
        {/*              {value}*/}
        {/*            </div>*/}
        {/*          );*/}
        {/*        })*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
    </div>
  );
};

export default Tests;

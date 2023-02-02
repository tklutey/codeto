import { Box, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useState } from 'react';
import { TEST_TYPES, testRegex, TestType, testUnitTest } from 'utils/testRunner';

const TestInputRow = ({ message, testCode, onChange, testInput }: Props) => {
  const [status, setStatus] = useState('fail');
  const [testType, setTestType] = useState<TestType>(TestType.regex);

  const handleTestTypeChange = (e: any) => {
    setTestType(e.target.value);
  };
  const handleChange = (key: string) => {
    return (e: any) => {
      onChange({ ...{ message, testCode: testCode, testType }, [key]: e.target.value });
    };
  };

  try {
    const isPassing = testType === TestType.regex ? testRegex(testInput, testCode) : testUnitTest(testInput, testCode);
    const currentStatus = isPassing ? 'pass' : 'fail';
    if (currentStatus !== status) {
      setStatus(currentStatus);
    }
  } catch (e) {
    console.log(e);
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Box>
        <InputLabel htmlFor="outlined-adornment-title">Test Type</InputLabel>
        <Select value={testType.valueOf()} onChange={handleTestTypeChange} label="Test Type">
          {TEST_TYPES.map((test_type) => (
            <MenuItem key={test_type} value={test_type}>
              {test_type}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box width={'50%'}>
        <InputLabel htmlFor="outlined-adornment-title">Message</InputLabel>
        <OutlinedInput fullWidth multiline id="outlined-adornment-title" type="text" value={message} onChange={handleChange('message')} />
      </Box>
      <Box width={'30%'}>
        <InputLabel htmlFor="outlined-adornment-title">{testType === TestType.regex ? 'Regex' : 'Unit Test'}</InputLabel>
        <OutlinedInput fullWidth id="outlined-adornment-title" type="text" value={testCode} onChange={handleChange('testCode')} />
      </Box>
      <Box width={'10%'}>
        <InputLabel htmlFor="outlined-adornment-title">Is Passing</InputLabel>
        {status === 'pass' ? <>✅</> : <>❌</>}
      </Box>
    </Box>
  );
};

type Props = {
  message: string;
  testCode: string;
  onChange: (test: any) => void;
  testInput: string;
};

export default TestInputRow;

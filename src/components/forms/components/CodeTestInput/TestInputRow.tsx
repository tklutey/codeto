import { Box, InputLabel, OutlinedInput } from '@mui/material';
import { useState } from 'react';

const TestInputRow = ({ message, testCode, onChange, testInput }: Props) => {
  const [status, setStatus] = useState('fail');
  const handleChange = (key: string) => {
    return (e: any) => {
      onChange({ ...{ message, testCode: testCode }, [key]: e.target.value });
    };
  };

  try {
    const currentStatus = testInput.match(testCode) && testCode.length > 0 ? 'pass' : 'fail';
    if (currentStatus !== status) {
      setStatus(currentStatus);
    }
  } catch (e) {
    console.log(e);
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Box width={'50%'}>
        <InputLabel htmlFor="outlined-adornment-title">Message</InputLabel>
        <OutlinedInput fullWidth multiline id="outlined-adornment-title" type="text" value={message} onChange={handleChange('message')} />
      </Box>
      <Box width={'30%'}>
        <InputLabel htmlFor="outlined-adornment-title">Regex</InputLabel>
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

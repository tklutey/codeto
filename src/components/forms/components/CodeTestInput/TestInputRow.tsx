import { Box, InputLabel, OutlinedInput } from '@mui/material';

const TestInputRow = ({ message, regex, onChange, regexTestText }: Props) => {
  const handleChange = (key: string) => {
    return (e: any) => {
      onChange({ ...{ message, regex }, [key]: e.target.value });
    };
  };

  const status = regexTestText.match(regex) && regex.length > 0 ? 'pass' : 'fail';
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '500px' }}>
      <div>
        <InputLabel htmlFor="outlined-adornment-title">Message</InputLabel>
        <OutlinedInput multiline id="outlined-adornment-title" type="text" value={message} onChange={handleChange('message')} />
      </div>
      <div>
        <InputLabel htmlFor="outlined-adornment-title">Regex</InputLabel>
        <OutlinedInput id="outlined-adornment-title" type="text" value={regex} onChange={handleChange('regex')} />
      </div>
      <div>
        <InputLabel htmlFor="outlined-adornment-title">Is Passing</InputLabel>
        {status === 'pass' ? <>✅</> : <>❌</>}
      </div>
    </Box>
  );
};

type Props = {
  message: string;
  regex: string;
  onChange: (test: any) => void;
  regexTestText: string;
};

export default TestInputRow;

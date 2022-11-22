import { Box, InputLabel, OutlinedInput } from '@mui/material';

const TestInputRow = ({ message, regex, onChange }: Props) => {
  const handleChange = (key: string) => {
    return (e: any) => {
      onChange({ ...{ message, regex }, [key]: e.target.value });
    };
  };
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '500px' }}>
      <div>
        <InputLabel htmlFor="outlined-adornment-title">Message</InputLabel>
        <OutlinedInput id="outlined-adornment-title" type="text" value={message} onChange={handleChange('message')} />
      </div>
      <div>
        <InputLabel htmlFor="outlined-adornment-title">Regex</InputLabel>
        <OutlinedInput id="outlined-adornment-title" type="text" value={regex} onChange={handleChange('regex')} />
      </div>
    </Box>
  );
};

type Props = {
  message: string;
  regex: string;
  onChange: (test: any) => void;
};

export default TestInputRow;

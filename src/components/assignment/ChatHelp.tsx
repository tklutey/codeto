import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';
import { trpc } from 'utils/trpc';

const ChatHelp = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const { refetch } = trpc.useQuery(['gpt.askQuestion', JSON.stringify({ question: chatMessage })], {
    enabled: false,
    onSuccess: (data: any) => {
      if (data) {
        setChatResponse(data);
      }
    }
  });

  const handleSubmit = async () => {
    setChatResponse('Loading...');
    await refetch();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(event.target.value);
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };
  return (
    <Box width={'100%'}>
      <FormControl sx={{ m: 1, width: '100%' }}>
        <InputLabel htmlFor="outlined-adornment-amount">Ask a question</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleSubmit}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Question"
          value={chatMessage}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={'How do I print text to the console?'}
        />
      </FormControl>
      {chatResponse && (
        <Box sx={{ marginX: '15px' }}>
          <Typography variant={'body2'}> {chatResponse}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatHelp;

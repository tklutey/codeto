import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
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
          label="Amount"
          value={chatMessage}
          onChange={(event) => setChatMessage(event.target.value)}
        />
      </FormControl>
      {chatResponse && <p>{chatResponse}</p>}
    </Box>
  );
};

export default ChatHelp;

import Question from './Question';
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/styles';

const Test = () => {
  const theme = useTheme();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  return (
    <Box>
      <Question
        prompt={'Which of these identifiers is legal as a variable name in Java (i.e. it will compile successfully)?'}
        answerOptions={['1stPlace', 'DAILY TAX RATE', 'while', 'salt&pepper', 'mySocialSecurity$_22']}
        setIsAnswerSelected={setIsAnswerSelected}
      />
      <Button
        variant="contained"
        disabled={!isAnswerSelected}
        sx={{
          margin: '14px',
          color: theme.palette.common.black,
          background: theme.palette.warning.dark,
          '&:hover': { background: theme.palette.warning.main }
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Test;

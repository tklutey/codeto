import Question from './Question';
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/styles';
import { trpc } from '../../utils/trpc';

const Test = () => {
  const theme = useTheme();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  trpc.useQuery(['multipleChoiceProblem.getById', 1], {
    onSuccess: (data) => {
      if (data) {
        setProblem(data);
      }
    }
  });
  return (
    <Box>
      {problem && <Question prompt={problem.prompt} answerOptions={problem.answerOptions} setIsAnswerSelected={setIsAnswerSelected} />}
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

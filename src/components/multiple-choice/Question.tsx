import { Box, Typography } from '@mui/material';
import React from 'react';
import AnswerOption from './AnswerOption';

const Question = ({ prompt, answerOptions }: Props) => {
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Typography variant={'body2'}>{prompt}</Typography>
      <Box display={'flex'} flexDirection={'column'} width={'50%'}>
        {answerOptions.map((option, index) => (
          <AnswerOption key={index} optionText={option} />
        ))}
      </Box>
    </Box>
  );
};

type Props = {
  prompt: string;
  answerOptions: string[];
};

export default Question;

import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import AnswerOption from './AnswerOption';

const Question = ({ prompt, answerOptions }: Props) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'50%'}>
      <Box width={'100%'}>
        <Typography variant={'h3'} sx={{ marginY: '10px' }}>
          {prompt}
        </Typography>
      </Box>
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        {answerOptions.map((option, index) => (
          <AnswerOption key={index} optionText={option} onClick={() => setSelectedAnswer(index)} isSelected={index === selectedAnswer} />
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

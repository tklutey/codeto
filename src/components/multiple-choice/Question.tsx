import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AnswerOption from './AnswerOption';

const Question = ({ prompt, answerOptions, setIsAnswerSelected }: Props) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  useEffect(() => {
    setIsAnswerSelected(selectedAnswer !== null);
  }, [selectedAnswer]);
  const handleClick = (index: number) => {
    if (selectedAnswer === index) {
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(index);
    }
  };
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'50%'}>
      <Box width={'100%'}>
        <Typography variant={'h4'} sx={{ marginY: '10px' }}>
          {prompt}
        </Typography>
      </Box>
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        {answerOptions.map((option, index) => (
          <AnswerOption key={index} optionText={option} onClick={() => handleClick(index)} isSelected={index === selectedAnswer} />
        ))}
      </Box>
    </Box>
  );
};

type Props = {
  prompt: string;
  answerOptions: string[];
  setIsAnswerSelected: (isAnswerSelected: boolean) => void;
};

export default Question;

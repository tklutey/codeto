import { Button } from '@mui/material';
import React from 'react';

const AnswerOption = ({ optionText, onClick, isSelected }: Props) => {
  return (
    <Button variant={isSelected ? 'contained' : 'outlined'} sx={{ marginY: '3px' }} onClick={onClick}>
      {optionText}
    </Button>
  );
};

type Props = {
  optionText: string;
  onClick: () => void;
  isSelected: boolean;
};
export default AnswerOption;

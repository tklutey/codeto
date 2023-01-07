import { Button } from '@mui/material';
import React from 'react';

const AnswerOption = ({ optionText }: Props) => {
  return (
    <Button variant={'outlined'} sx={{ marginY: '3px' }}>
      {optionText}
    </Button>
  );
};

type Props = {
  optionText: string;
};
export default AnswerOption;

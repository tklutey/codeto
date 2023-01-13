import { Button } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const AnswerOption = ({ optionText, onClick, isSelected }: Props) => {
  return (
    <Button variant={isSelected ? 'contained' : 'outlined'} sx={{ marginY: '3px' }} onClick={onClick}>
      {/* eslint-disable-next-line react/no-children-prop */}
      <ReactMarkdown children={optionText} />
    </Button>
  );
};

type Props = {
  optionText: string;
  onClick: () => void;
  isSelected: boolean;
};
export default AnswerOption;

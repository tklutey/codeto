import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';
import React from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  height: '85%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const AssessmentIntroModal = ({ isOpen, handleClose }: Props) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant={'h2'}>Here is some text</Typography>
      </Box>
    </Modal>
  );
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export default AssessmentIntroModal;

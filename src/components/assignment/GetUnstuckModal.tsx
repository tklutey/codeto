import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/styles';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const GetUnstuckModal = (props: Props) => {
  const { isOpen, handleClose, youtubeTutorialUrl } = props;
  const [isUserCodeCorrect, setIsUserCodeCorrect] = useState(false);
  const theme = useTheme();
  const goToNextProblem = () => {
    handleClose();
  };

  const updateCode = (newCode?: string, _?: any) => {
    if (newCode !== undefined) {
      setUserCode(newCode);
      if (newCode === solutionCode) {
        setIsUserCodeCorrect(true);
      } else {
        setIsUserCodeCorrect(false);
      }
    }
  };
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h2">Get Unstuck</Typography>
        <iframe
          src={youtubeTutorialUrl}
          width="45%"
          height="90%"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Box>
    </Modal>
  );
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  youtubeTutorialUrl: string;
};

export default GetUnstuckModal;

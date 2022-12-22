import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';
import React from 'react';
import ChatHelp from 'components/assignment/ChatHelp';

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

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h2">Get Unstuck</Typography>
        <Box display={'flex'} height={'100%'}>
          <iframe
            src={youtubeTutorialUrl}
            width="45%"
            height="90%"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <ChatHelp />
        </Box>
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

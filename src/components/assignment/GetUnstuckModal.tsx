import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';
import React from 'react';
import ChatHelp from 'components/assignment/ChatHelp';
import { styled } from '@mui/material/styles';
import VideoPlayer from 'components/assignment/VideoPlayer';

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

const ContentBox = styled(Box)({
  width: '100%'
});

const GetUnstuckModal = (props: Props) => {
  const { isOpen, handleClose, youtubeTutorialUrl } = props;

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h2" sx={{ marginBottom: '25px' }}>
          Get Unstuck
        </Typography>
        <Box display={'flex'} height={'100%'} width={'100%'}>
          <ContentBox>{youtubeTutorialUrl && <VideoPlayer youtubeTutorialUrl={youtubeTutorialUrl} />}</ContentBox>
          <ContentBox>
            <ChatHelp />
          </ContentBox>
        </Box>
      </Box>
    </Modal>
  );
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  youtubeTutorialUrl?: string | undefined;
};

export default GetUnstuckModal;

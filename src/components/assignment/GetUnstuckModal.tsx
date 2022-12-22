import Modal from '@mui/material/Modal';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import React from 'react';
import SendIcon from '@mui/icons-material/Send';

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
          <FormControl sx={{ m: 1, width: '50%' }}>
            <InputLabel htmlFor="outlined-adornment-amount">Ask a question</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => console.log('click')}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Amount"
            />
          </FormControl>
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

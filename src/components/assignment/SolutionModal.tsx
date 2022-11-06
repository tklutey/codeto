import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import CodeEditor from 'components/ide/CodeEditor';
import React from 'react';
import { useTheme } from '@mui/styles';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  height: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const SolutionModal = (props: Props) => {
  const { isOpen, handleClose, solutionCode, language, onNextClicked } = props;
  const theme = useTheme();
  const goToNextProblem = () => {
    handleClose();
    onNextClicked();
  };
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h2" component="h2">
          Solution
        </Typography>
        <CodeEditor language={language} startingCode={solutionCode} width={'100%'} height={'90%'} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{
              marginTop: '8px',
              color: theme.palette.common.black,
              background: theme.palette.warning.dark,
              '&:hover': { background: theme.palette.warning.main }
            }}
            onClick={goToNextProblem}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  solutionCode: string;
  language: string;
  onNextClicked: () => void;
};

export default SolutionModal;

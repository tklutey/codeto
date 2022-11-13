import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/styles';
import ThemedDiffEditor from 'components/ide/editor/ThemedDiffEditor';

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

const SolutionModal = (props: Props) => {
  const { isOpen, handleClose, solutionCode, language, onNextClicked, userCode, setUserCode } = props;
  const theme = useTheme();
  const goToNextProblem = () => {
    handleClose();
    onNextClicked();
  };

  const updateCode = (newCode?: string, _?: any) => {
    if (newCode !== undefined) {
      setUserCode(newCode);
    }
  };
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '50%' }}>
            <Typography id="modal-modal-title" variant="h2" component="h2">
              Solution
            </Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography id="modal-modal-title" variant="h2" component="h2">
              Your Code
            </Typography>
          </Box>
        </Box>
        <ThemedDiffEditor language={language} originalCode={solutionCode} modifiedCode={userCode} updateCode={updateCode} />
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
  userCode?: string;
  setUserCode: (code: string) => void;
};

export default SolutionModal;

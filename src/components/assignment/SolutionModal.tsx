import Modal from '@mui/material/Modal';
import { Alert, Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/styles';
import ThemedDiffEditor from 'components/ide/editor/ThemedDiffEditor';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const SolutionModal = (props: Props) => {
  const { isOpen, handleClose, solutionCode, language, userCode, setUserCode } = props;
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
        <Alert severity="info" sx={{ marginY: '10px' }}>
          Modify your code on the right to match the solution code.
        </Alert>
        <Box sx={{ display: 'flex', paddingBottom: '10px' }}>
          <Box sx={{ width: '50%' }}>
            <Typography variant="h4">Solution</Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography variant="h4">Your Code</Typography>
          </Box>
        </Box>
        <ThemedDiffEditor language={language} originalCode={solutionCode} modifiedCode={userCode} updateCode={updateCode} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            disabled={!isUserCodeCorrect}
            sx={{
              marginTop: '8px',
              color: theme.palette.common.black,
              background: theme.palette.warning.dark,
              '&:hover': { background: theme.palette.warning.main }
            }}
            onClick={goToNextProblem}
          >
            Test Your Solution
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
  userCode?: string;
  setUserCode: (code: string) => void;
};

export default SolutionModal;

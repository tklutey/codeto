import Modal from '@mui/material/Modal';
import React from 'react';
import AssignmentWalkthrough from 'components/assignment/AssignmentWalkthrough';

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

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box style={style}>
        <AssignmentWalkthrough
            handleTestCode={handleClose}
            solutionCode={solutionCode}
            language={language}
            userCode={userCode}
            setUserCode={setUserCode}
        />
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

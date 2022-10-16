import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';
import CodeEditor from 'components/ide/CodeEditor';

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
  const { isOpen, handleClose, solutionCode, language } = props;
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h2" component="h2">
          Solution
        </Typography>
        <CodeEditor language={language} startingCode={solutionCode} width={'100%'} height={'90%'} />
      </Box>
    </Modal>
  );
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  solutionCode: string;
  language: string;
};

export default SolutionModal;

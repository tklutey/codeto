import { Box, Button, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { useRouter } from 'next/router';

const style = {
  position: 'absolute' as 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '30%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
const SolutionModal = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Modal open={true} onClose={() => {}}>
      <Box sx={style}>
        <Typography variant="h2" component="h2">
          Mastery Achieved!
        </Typography>
        <Typography variant="body2" component="h2">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          You've mastered all of the skills in this unit. Head to the dashboard to see your progress.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{
              marginTop: '8px',
              color: theme.palette.common.black,
              background: theme.palette.warning.dark,
              '&:hover': { background: theme.palette.warning.main }
            }}
            onClick={() => router.push('/student/dashboard')}
          >
            Go To Dashboard
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SolutionModal;

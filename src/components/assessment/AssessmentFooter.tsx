import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import FooterStrip from 'components/footer/FooterStrip';
import LinearProgressWithLabel from '../progress/LinearProgressWithLabel';

const ButtonStrip = styled(Box)(({ theme }) => ({
  display: 'flex'
}));
const AssessmentFooter = ({ disabled, onNextClicked, onSkipClicked }: Props) => {
  const theme = useTheme();
  return (
    <FooterStrip>
      <Box width={'70%'} display={'flex'}>
        <Typography variant="body2" color="text.secondary" sx={{ marginX: '15px' }}>
          Assessment Progress
        </Typography>
        <LinearProgressWithLabel value={70} />
      </Box>
      <ButtonStrip>
        <Button
          variant="contained"
          sx={{
            margin: '14px',
            color: theme.palette.common.black,
            background: theme.palette.error.main,
            '&:hover': { background: theme.palette.error.dark }
          }}
          onClick={onSkipClicked}
        >
          Too Hard
        </Button>
        <Button
          variant="contained"
          sx={{
            margin: '14px',
            color: theme.palette.common.black,
            background: theme.palette.success.main,
            '&:hover': { background: theme.palette.success.dark }
          }}
          onClick={onNextClicked}
        >
          Too Easy
        </Button>
        <Button
          variant="contained"
          disabled={disabled}
          sx={{
            margin: '14px',
            color: theme.palette.common.black,
            background: theme.palette.warning.dark,
            '&:hover': { background: theme.palette.warning.main }
          }}
          onClick={onNextClicked}
        >
          Next
        </Button>
      </ButtonStrip>
    </FooterStrip>
  );
};

type Props = {
  disabled: boolean;
  onNextClicked?: () => void;
  onSkipClicked: () => void;
};

export default AssessmentFooter;

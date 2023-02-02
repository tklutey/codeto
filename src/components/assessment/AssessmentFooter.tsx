import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/styles';
import MasteryStepper from 'components/assignment/MasteryStepper';
import { MasteryStatus } from 'server/types';
import AdaptiveModeToggle from 'components/assignment/AdaptiveModeToggle';
import FooterStrip from 'components/footer/FooterStrip';

const ButtonStrip = styled(Box)(({ theme }) => ({
  display: 'flex'
}));
const AssessmentFooter = ({ disabled, onNextClicked }: Props) => {
  const theme = useTheme();
  return (
    <FooterStrip>
      <span />
      <span />
      <ButtonStrip>
        <Button
          variant="contained"
          sx={{
            margin: '14px',
            color: theme.palette.common.black,
            background: theme.palette.error.main,
            '&:hover': { background: theme.palette.error.dark }
          }}
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
};

export default AssessmentFooter;

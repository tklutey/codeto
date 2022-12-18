import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Tooltip } from '@mui/material';
import { useTheme } from '@mui/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MasteryStepper from 'components/assignment/MasteryStepper';
import { MasteryStatus } from 'server/types';

const FooterStrip = styled('footer')(({ theme }) => ({
  width: 'calc(100% + 40px)',
  height: '10%',
  background: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'space-between',
  marginLeft: '-20px',
  marginBottom: '-20px',
  marginRight: '-20px'
}));

const ButtonStrip = styled(Box)(({ theme }) => ({
  display: 'flex'
}));
const AssignmentFooter = ({ disabled, onNextClicked, onSkipClicked, onShowSolutionClicked, masteryStatus }: Props) => {
  const theme = useTheme();
  return (
    <FooterStrip>
      <MasteryStepper currentMasteryStatus={masteryStatus} />
      <ButtonStrip>
        <Button
          variant="contained"
          color="primary"
          sx={{
            margin: '14px'
          }}
          onClick={onSkipClicked}
        >
          Skip
        </Button>
        <Tooltip title={'Using the solution means you will not get credit for this problem.'}>
          <Button
            variant="outlined"
            sx={{
              margin: '14px'
            }}
            onClick={onShowSolutionClicked}
          >
            <HelpOutlineIcon fontSize={'small'} />
            &nbsp;&nbsp;&nbsp;Solution
          </Button>
        </Tooltip>
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
  onSkipClicked?: () => void;
  onShowSolutionClicked?: () => void;
  masteryStatus: MasteryStatus;
};

export default AssignmentFooter;

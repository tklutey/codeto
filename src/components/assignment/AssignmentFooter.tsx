import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MasteryStepper from 'components/assignment/MasteryStepper';
import { MasteryStatus } from 'server/types';
import AdaptiveModeToggle from 'components/assignment/AdaptiveModeToggle';
import FooterStrip from 'components/footer/FooterStrip';

const ButtonStrip = styled(Box)(({ theme }) => ({
  display: 'flex'
}));
const AssignmentFooter = ({
  disabled,
  onNextClicked,
  onSkipClicked,
  onShowSolutionClicked,
  masteryStatus,
  allowShowSolution,
  isAdaptiveMode
}: Props) => {
  const theme = useTheme();
  return (
    <FooterStrip>
      <AdaptiveModeToggle isAdaptiveMode={isAdaptiveMode} onSkipClicked={onSkipClicked} />
      {masteryStatus !== undefined && masteryStatus !== null && <MasteryStepper currentMasteryStatus={masteryStatus} />}
      <ButtonStrip>
        {allowShowSolution && (
          <Button
            variant="outlined"
            sx={{
              margin: '14px'
            }}
            onClick={onShowSolutionClicked}
          >
            <HelpOutlineIcon fontSize={'small'} />
            &nbsp;&nbsp;&nbsp;Walkthrough
          </Button>
        )}
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
  masteryStatus?: MasteryStatus;
  allowShowSolution: boolean;
  isAdaptiveMode?: boolean;
};

export default AssignmentFooter;

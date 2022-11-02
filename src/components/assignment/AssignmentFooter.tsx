import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useTheme } from '@mui/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const FooterStrip = styled('footer')(({ theme }) => ({
  width: 'calc(100% + 40px)',
  height: '10%',
  background: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'flex-end',
  marginLeft: '-20px',
  marginBottom: '-20px',
  marginRight: '-20px'
}));
const AssignmentFooter = (props: Props) => {
  const { disabled, onProblemCorrect, setShowSolution } = props;
  const theme = useTheme();
  return (
    <FooterStrip>
      <Button
        variant="outlined"
        sx={{
          margin: '14px'
        }}
        onClick={() => setShowSolution(true)}
      >
        <HelpOutlineIcon fontSize={'small'} />
        &nbsp;&nbsp;&nbsp;Solution
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
        onClick={onProblemCorrect}
      >
        Next
      </Button>
    </FooterStrip>
  );
};

type Props = {
  disabled: boolean;
  onProblemCorrect?: () => void;
  setShowSolution: (show: boolean) => void;
};

export default AssignmentFooter;

import React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Tooltip } from '@mui/material';
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
  const { disabled, onNextClicked, onShowSolutionClicked } = props;
  const theme = useTheme();
  return (
    <FooterStrip>
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
    </FooterStrip>
  );
};

type Props = {
  disabled: boolean;
  onNextClicked?: () => void;
  onShowSolutionClicked?: () => void;
};

export default AssignmentFooter;

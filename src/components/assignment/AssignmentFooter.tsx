import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useTheme } from '@mui/styles';

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
const AssignmentFooter = () => {
  const theme = useTheme();
  return (
    <FooterStrip>
      <Button
        variant="contained"
        sx={{
          margin: '14px',
          color: theme.palette.common.black,
          background: theme.palette.warning.dark,
          '&:hover': { background: theme.palette.warning.main }
        }}
      >
        Next
      </Button>
    </FooterStrip>
  );
};

export default AssignmentFooter;

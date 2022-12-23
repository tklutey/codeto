import { Box, Button } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/styles';
import FooterStrip from 'components/footer/FooterStrip';
import { useRouter } from 'next/router';

const StudentDashboardFooter = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <FooterStrip>
      <Box width={'100%'} display={'flex'} justifyContent={'flex-end'}>
        <Button
          variant="contained"
          sx={{
            margin: '14px',
            color: theme.palette.common.black,
            background: theme.palette.warning.dark,
            '&:hover': { background: theme.palette.warning.main }
          }}
          onClick={() => router.push('/student/practice')}
        >
          Start Learning
        </Button>
      </Box>
    </FooterStrip>
  );
};

export default StudentDashboardFooter;

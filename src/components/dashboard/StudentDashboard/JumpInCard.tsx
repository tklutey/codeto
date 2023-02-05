import ColoredHeaderCard from 'ui-component/cards/ColoredHeaderCard';
import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';

const JumpInCard = () => {
  const router = useRouter();
  return (
    <ColoredHeaderCard title={'Jump In'}>
      <Grid container spacing={1} direction={'column'}>
        <Grid item>
          <Typography variant={'body2'}>Take the diagnostic assessment to show what you know.</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => router.push('/assessment')}>
            Assess
          </Button>
        </Grid>
      </Grid>
    </ColoredHeaderCard>
  );
};

export default JumpInCard;

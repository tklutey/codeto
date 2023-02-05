import ColoredHeaderCard from 'ui-component/cards/ColoredHeaderCard';
import { Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import useAuth from '../../../hooks/useAuth';

const JumpInCard = () => {
  const [shouldContinueDiagnosing, setShouldContinueDiagnosing] = useState(false);
  const { user } = useAuth();
  if (!user || !user.id) {
    throw new Error('User not found');
  }
  const router = useRouter();
  trpc.useQuery(
    [
      'engine.getAssessmentProblemsByDistance',
      JSON.stringify({
        userId: user.id,
        courseId: 2,
        order: 'desc'
      })
    ],
    {
      onSuccess: (data) => {
        if (data) {
          setShouldContinueDiagnosing(data.length > 0);
        }
      }
    }
  );
  return (
    <>
      {shouldContinueDiagnosing && (
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
      )}
    </>
  );
};

export default JumpInCard;

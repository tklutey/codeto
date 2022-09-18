import React, { ReactElement } from 'react';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, LinearProgress, Typography } from '@mui/material';
import { trpc } from 'utils/trpc';

const StudentDashboard = () => {
  const studentMasteryData = trpc.useQuery(['knowledgeState.get']);

  return (
    <MainCard title="Student Mastery" style={{ width: '100%' }}>
      {studentMasteryData?.data && (
        <Grid container spacing={2}>
          {studentMasteryData.data.map((unitData) => (
            <Grid item key={unitData.unit_id} xs={12}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item sm zeroMinWidth>
                  <Typography variant="body2">{unitData.unit_name}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" align="right">
                    {unitData.unit_mastery}%
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <LinearProgress variant="determinate" value={unitData.unit_mastery} color="primary" />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </MainCard>
  );
};

StudentDashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default StudentDashboard;

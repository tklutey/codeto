import React, { ReactElement } from 'react';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, LinearProgress, Typography } from '@mui/material';
import { trpc } from 'utils/trpc';

const StudentDashboard = () => {
  const studentMasteryData = trpc.useQuery(['getCurrentKnowledgeState']);

  return (
    <MainCard title="Student Mastery" style={{ width: '70%' }}>
      {studentMasteryData?.data && (
        <Grid container spacing={2}>
          {Object.entries(studentMasteryData.data).map(([key, value]) => (
            <Grid item key={key} xs={12}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item sm zeroMinWidth>
                  <Typography variant="body2">{key}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" align="right">
                    {value}%
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <LinearProgress variant="determinate" value={value} color="primary" />
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

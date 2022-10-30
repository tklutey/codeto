import React, { ReactElement } from 'react';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, LinearProgress, Typography } from '@mui/material';
import { trpc } from 'utils/trpc';
import useAuth from 'hooks/useAuth';
import SkeletonStudentMasteryChart from 'components/skeleton/SkeletonStudentMasteryChart';
import Page from 'ui-component/Page';

const StudentDashboard = () => {
  const { user } = useAuth();
  if (!user || !user.id) {
    throw new Error('User not found');
  }
  const studentMasteryData = trpc.useQuery(['knowledgeState.getUserCourseMasterySummary', user.id]);

  return (
    <Page title="Dashboard">
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
        {!studentMasteryData?.data && <SkeletonStudentMasteryChart rows={10} />}
      </MainCard>
    </Page>
  );
};

StudentDashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default StudentDashboard;

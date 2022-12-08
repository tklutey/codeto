import React, { ReactElement, useState } from 'react';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, LinearProgress, Typography } from '@mui/material';
import { trpc } from 'utils/trpc';
import useAuth from 'hooks/useAuth';
import SkeletonStudentMasteryChart from 'components/skeleton/SkeletonStudentMasteryChart';
import Page from 'ui-component/Page';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dataLevel, setDataLevel] = useState<'UNIT' | 'TOPIC'>('UNIT');
  if (!user || !user.id) {
    throw new Error('User not found');
  }
  const studentMasteryData = trpc.useQuery(['knowledgeState.getUserCourseMasterySummary', user.id]);

  const getChartData = (masteryData: any) => {
    if (dataLevel === 'UNIT') {
      return masteryData?.map((unitData: any) => {
        return {
          name: unitData.unit_name,
          percentage: unitData.unit_mastery
        };
      });
    } else {
      return masteryData?.map((unitData: any) => {
        return {
          name: unitData.unit_name,
          percentage: unitData.unit_mastery
        };
      });
    }
  };

  const toggleChartLevel = () => {
    setDataLevel(dataLevel === 'UNIT' ? 'TOPIC' : 'UNIT');
  };

  if (studentMasteryData?.data) {
    const unitMastery = getChartData(studentMasteryData.data);
    return (
      <Page title="Dashboard">
        <MainCard title="Student Mastery" style={{ width: '100%' }}>
          <Grid container spacing={2}>
            {unitMastery.map((unitData: any) => (
              <Grid item key={unitData.unit_id} xs={12}>
                <Grid container alignItems="center" spacing={1} onClick={toggleChartLevel}>
                  <Grid item sm zeroMinWidth>
                    <Typography variant="body2">{unitData.name}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" align="right">
                      {unitData.percentage}%
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <LinearProgress variant="determinate" value={unitData.percentage} color="primary" />
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </MainCard>
      </Page>
    );
  }
  return (
    <Page title="Dashboard">
      <MainCard title="Student Mastery" style={{ width: '100%' }}>
        <SkeletonStudentMasteryChart rows={10} />
      </MainCard>
    </Page>
  );
};

StudentDashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default StudentDashboard;

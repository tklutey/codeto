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
  const [chartData, setChartData] = useState<any>(null);
  if (!user || !user.id) {
    throw new Error('User not found');
  }

  const getChartData = (masteryData: any) => {
    return masteryData?.map((unitData: any) => {
      return {
        key: unitData.unit_id,
        name: unitData.unit_name,
        percentage: unitData.unit_mastery
      };
    });
  };

  const studentMasteryData = trpc.useQuery(['knowledgeState.getUserCourseMasterySummary', user.id], {
    onSuccess: (data) => {
      if (data) {
        setChartData(getChartData(data));
      }
    }
  });

  const drillDown = (masteryData: any, index: number) => {
    if (dataLevel === 'UNIT') {
      setDataLevel('TOPIC');
    } else {
      return;
    }
    // get the element matching the index
    const { standards } = masteryData[index];
    // group standards into distinct topics
    const topics = standards.reduce((acc: any, standard: any) => {
      const { topic_id, topic_description } = standard;
      if (!acc[topic_id]) {
        acc[topic_id] = {
          topic_id,
          topic_description,
          standards: []
        };
      }
      acc[topic_id].standards.push(standard);
      return acc;
    }, {});
    const topicsFormatted = Object.entries(topics).map(([key, value]: [string, any]) => {
      const { standards: topicStandards } = value;
      // calculate percentage of standards mastered
      const masteredStandards = topicStandards.filter((standard: any) => standard.mastered);
      const percentage = (masteredStandards.length / topicStandards.length) * 100;
      // round to whole number
      const percentageRounded = Math.round(percentage);
      return {
        key: key,
        name: value.topic_description,
        percentage: percentageRounded
      };
    });
    setChartData(topicsFormatted);
  };

  if (chartData) {
    return (
      <Page title="Dashboard">
        <MainCard title="Student Mastery" style={{ width: '100%' }}>
          <Grid container spacing={2}>
            {chartData.map((unitData: any, index: number) => (
              <Grid item key={unitData.key} xs={12}>
                <Grid
                  container
                  alignItems="center"
                  spacing={1}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => drillDown(studentMasteryData.data, index)}
                >
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

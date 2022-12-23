import React, { ReactElement, useState } from 'react';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Button, Grid, LinearProgress, Typography } from '@mui/material';
import { trpc } from 'utils/trpc';
import useAuth from 'hooks/useAuth';
import SkeletonStudentMasteryChart from 'components/skeleton/SkeletonStudentMasteryChart';
import Page from 'ui-component/Page';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import StudentDashboardFooter from 'components/dashboard/StudentDashboard/StudentDashboardFooter';

type DrilldownFilters = {
  unitIndex?: number;
};
const StudentDashboard = () => {
  const { user } = useAuth();
  const [drilldownFilters, setDrilldownFilters] = useState<DrilldownFilters>({});
  const [chartData, setChartData] = useState<any>(null);
  if (!user || !user.id) {
    throw new Error('User not found');
  }

  trpc.useQuery(['knowledgeState.getUserCourseMasterySummary', user.id], {
    onSuccess: (data) => {
      if (data) {
        setChartData(data);
      }
    }
  });

  const getUnitData = (masteryData: any) => {
    return masteryData?.map((unitData: any) => {
      return {
        key: unitData.id,
        name: `Unit ${unitData.unit_sequence}: ${unitData.unit_name}`,
        percentage: unitData.unit_mastery
      };
    });
  };

  const getTopicData = (masteryData: any, unitIndex: number) => {
    // get the element matching the index
    const { standards } = masteryData[unitIndex];
    // group standards into distinct topics
    const topics = standards.reduce((acc: any, standard: any) => {
      const { topic_id, topic_description, topic_code } = standard;
      if (!acc[topic_id]) {
        acc[topic_id] = {
          topic_id,
          topic_description,
          topic_code,
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
        name: `${value.topic_code}: ${value.topic_description}`,
        percentage: percentageRounded,
        sortIndex: parseFloat(value.topic_code)
      };
    });
    const sortedTopics = topicsFormatted.sort((a: any, b: any) => a.sortIndex - b.sortIndex);
    return sortedTopics;
  };

  const filterMasteryData = (masteryData: any) => {
    const { unitIndex } = drilldownFilters;
    if (unitIndex !== undefined) {
      return getTopicData(masteryData, unitIndex);
    } else {
      return getUnitData(masteryData);
    }
  };

  if (chartData) {
    return (
      <Page title="Dashboard">
        <Box>
          <MainCard title="Student Mastery" style={{ width: '100%' }}>
            {drilldownFilters.unitIndex !== undefined && (
              <Button variant="outlined" sx={{ marginBottom: '20px' }} onClick={() => setDrilldownFilters({})}>
                <ArrowBackIosIcon />
                Back
              </Button>
            )}
            <Grid container spacing={2}>
              {filterMasteryData(chartData).map((unitData: any, index: number) => (
                <Grid item key={unitData.key} xs={12}>
                  <Grid
                    container
                    alignItems="center"
                    spacing={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setDrilldownFilters({ unitIndex: index })}
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
          <StudentDashboardFooter />
        </Box>
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

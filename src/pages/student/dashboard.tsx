import React, { ReactElement } from 'react';
import Layout from 'layout';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, LinearProgress, Typography } from '@mui/material';

const getStudentMasteryMockApi = () => {
  return {
    'Primitive Types': 100,
    'Using Objects': 100,
    'Boolean Expressions and if Statements': 100,
    Iteration: 80,
    'Writing Classes': 70,
    Array: 50,
    ArrayList: 30,
    '2D Array': 10,
    Inheritance: 0,
    Recursion: 0
  };
};

// function to capitalize first letter of string
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const StudentDashboard = () => {
  const studentMastery = getStudentMasteryMockApi();
  return (
    <MainCard title="Student Mastery" style={{ width: '70%' }}>
      <Grid container spacing={2}>
        {Object.entries(studentMastery).map(([key, value]) => (
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
    </MainCard>
  );
};

StudentDashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default StudentDashboard;

import React from 'react';
import { Step, StepConnector, stepConnectorClasses, StepIcon, StepLabel, Stepper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1
  }
}));

const MasteryStepper = () => {
  const steps = ['Learned', 'Practiced', 'Mastered'];

  return (
    <Stepper alternativeLabel activeStep={1} connector={<StyledStepConnector />}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default MasteryStepper;

import React from 'react';
import { Step, StepConnector, stepConnectorClasses, StepIcon, StepLabel, Stepper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MasteryStatus } from 'server/types';

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

const MasteryStepper = ({ currentMasteryStatus }: Props) => {
  const steps = [MasteryStatus[MasteryStatus.Learned], MasteryStatus[MasteryStatus.Practiced], MasteryStatus[MasteryStatus.Mastered]];
  const currentStepStage = currentMasteryStatus.valueOf() + 1;

  return (
    <Stepper alternativeLabel activeStep={currentStepStage} connector={<StyledStepConnector />} sx={{ width: '80%' }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

type Props = {
  currentMasteryStatus: MasteryStatus;
};

export default MasteryStepper;

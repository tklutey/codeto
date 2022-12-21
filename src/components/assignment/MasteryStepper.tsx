import React from 'react';
import { Step, StepConnector, stepConnectorClasses, StepIcon, StepLabel, stepLabelClasses, Stepper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MasteryStatus } from 'server/types';

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  [`& .${stepLabelClasses.label}`]: {
    marginTop: '5px'
  },

  [`&.${stepLabelClasses.label}`]: {
    [`& .${stepLabelClasses.alternativeLabel}`]: {
      marginTop: '5px'
    }
  }
}));

console.log(StyledStepLabel);
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

  return (
    <Stepper alternativeLabel activeStep={currentMasteryStatus} connector={<StyledStepConnector />} sx={{ width: '80%' }}>
      {steps.map((label) => (
        <Step key={label}>
          <StyledStepLabel StepIconComponent={StepIcon}>{label}</StyledStepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

type Props = {
  currentMasteryStatus: MasteryStatus;
};

export default MasteryStepper;

import { FormControlLabel, formControlLabelClasses, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  [`&.${formControlLabelClasses.root}`]: {
    marginLeft: '0px',
    minWidth: '170px'
  }
}));
const AdaptiveModeToggle = ({ isAdaptiveMode, onSkipClicked }: Props) => {
  const [checked, setChecked] = useState(isAdaptiveMode);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked((prevState) => !prevState);
    if (onSkipClicked) {
      onSkipClicked();
    }
  };

  useEffect(() => {
    setChecked(isAdaptiveMode);
  }, [isAdaptiveMode]);
  return (
    <StyledFormControlLabel
      control={<Switch checked={checked} disabled={!isAdaptiveMode} onChange={handleChange} />}
      label={'Adaptive Mode'}
    />
  );
};

type Props = {
  isAdaptiveMode?: boolean;
  onSkipClicked?: () => void;
};

export default AdaptiveModeToggle;

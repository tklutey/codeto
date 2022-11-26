import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/styles';

const FormTextInput = ({ key, values, errors, touched, handleBlur, handleChange }: Props) => {
  const theme = useTheme();

  const id = `outlined-adornment-${key}`;
  return (
    <FormControl error={Boolean(touched[key] && errors[key])} fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor={id}>{key}</InputLabel>
      <OutlinedInput
        id={id}
        type="text"
        value={values[key]}
        name={key}
        onBlur={handleBlur}
        onChange={handleChange}
        label={key}
        inputProps={{}}
      />
      {touched[key] && errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
    </FormControl>
  );
};

type Props = {
  key: string;
  values: any;
  errors: any;
  touched: any;
  handleBlur: () => void;
  handleChange: () => void;
};

export default FormTextInput;

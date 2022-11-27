import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/styles';
import { ChangeEvent } from 'react';

const FormTextInput = ({ fieldName, values, errors, touched, handleBlur, handleChange }: Props) => {
  const theme = useTheme();
  // capitalize first letter of fieldName
  const fieldNameCapitalized = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

  const id = `outlined-adornment-${fieldName}`;
  return (
    <FormControl error={Boolean(touched[fieldName] && errors[fieldName])} fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor={id}>{fieldNameCapitalized}</InputLabel>
      <OutlinedInput
        id={id}
        type="text"
        value={values[fieldName]}
        name={fieldName}
        onBlur={handleBlur}
        onChange={handleChange}
        label={fieldNameCapitalized}
        inputProps={{}}
      />
      {touched[fieldName] && errors[fieldName] && <FormHelperText>{errors[fieldName]}</FormHelperText>}
    </FormControl>
  );
};

type Props = {
  fieldName: string;
  values: any;
  errors: any;
  touched: any;
  handleBlur: { (e: FocusEvent): void; <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void };
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any> ? void : (e: string | ChangeEvent<any>) => void;
  };
};

export default FormTextInput;

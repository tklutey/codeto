import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const FormSelectInput = ({ fieldName, values, selectOptions, handleChange }: Props) => {
  // capitalize first letter of fieldName
  const fieldNameCapitalized = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={fieldName}>{fieldNameCapitalized}</InputLabel>
      <Select id={fieldName} name={fieldName} value={values[fieldName]} label={fieldNameCapitalized} onChange={handleChange}>
        {selectOptions.map((o) => (
          <MenuItem key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

type Props = {
  fieldName: string;
  values: any;
  selectOptions: any[];
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any> ? void : (e: string | ChangeEvent<any>) => void;
  };
};

export default FormSelectInput;

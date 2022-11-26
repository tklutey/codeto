import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const FormSelectInput = ({ key, values, selectOptions, handleChange }: Props) => {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={key}>{key}</InputLabel>
      <Select id={key} name={key} value={values[key]} label={key} onChange={handleChange}>
        {selectOptions.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

type Props = {
  key: string;
  values: any;
  selectOptions: any[];
  handleChange: () => void;
};

export default FormSelectInput;

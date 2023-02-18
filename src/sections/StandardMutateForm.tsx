import { Formik } from 'formik';
import FormSelectInput from '../components/forms/components/FormInputs/FormSelectInput';
import FormTextInput from '../components/forms/components/FormInputs/FormTextInput';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import LearningStandardMultiselect from '../components/forms/components/CodingProblemSkillChooser/LearningStandardMultiselect';
import AnimateButton from 'ui-component/extended/AnimateButton';
import React, { useState } from 'react';
import { UseMutationResult } from 'react-query';

const mapStandardToString = (s: any) => {
  return `${s.code} | ${s.description}`;
};
const StandardMutateForm = ({ allStandards, allObjectives, createStandardOperation, code, description }: Props) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [standards, setStandards] = useState(allStandards);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  if (!allObjectives || !standards) {
    return <div>Loading...</div>;
  }
  return (
    <Formik
      initialValues={{
        standards: standards,
        type: 'standard',
        code: code,
        description: description,
        parent: allObjectives[0].id
      }}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        const dependentStandards = standards.filter((standard) => standard.isChecked).map((standard) => standard.standard_id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { standards: x, ...rest } = values;
        const mergedValues = { ...rest, dependentStandards };
        const { error } = await createStandardOperation.mutateAsync(mergedValues);
        if (error) {
          setStatus({ success: false });
        } else {
          setStatus({ success: true });
        }
        setSubmitting(false);
        setSnackbarOpen(true);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, status, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <FormSelectInput fieldName={'type'} values={values} selectOptions={['standard']} handleChange={handleChange} />

          <FormTextInput
            fieldName={'code'}
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />

          <FormTextInput
            fieldName={'description'}
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />

          {values.type === 'standard' && (
            <Box>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Dependent Skills
              </Typography>
              <LearningStandardMultiselect standards={standards} setStandards={setStandards} />
            </Box>
          )}

          <FormControl fullWidth>
            <InputLabel htmlFor={'parent'}>Parent Standard</InputLabel>
            <Select id={'parent'} name={'parent'} value={values.parent} label={'Parent'} onChange={handleChange}>
              {(allObjectives ? allObjectives : []).map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {mapStandardToString(o)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                Submit
              </Button>
            </AnimateButton>
          </Box>

          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={status?.success === true ? 'success' : 'error'} sx={{ width: '100%' }}>
              {status?.success === true ? 'Saved standard successfully!' : 'Error saving standard.'}
            </Alert>
          </Snackbar>
        </form>
      )}
    </Formik>
  );
};

type Props = {
  allStandards: any[];
  allObjectives: any[];
  createStandardOperation: UseMutationResult<any, any, any, any>;
  code?: string;
  description?: string;
};

export default StandardMutateForm;

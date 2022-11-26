import React, { ReactElement, useState } from 'react';
import Layout from 'layout';
import CodingProblemSkillChooser from 'components/forms/components/CodingProblemSkillChooser/CodingProblemSkillChooser';
import Page from 'ui-component/Page';
import { Formik } from 'formik';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  Typography
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import useLearningStandards from 'hooks/useLearningStandards';
import { useTheme } from '@mui/styles';
import { trpc } from 'utils/trpc';

const NewStandardPage = () => {
  const { standards, setStandards } = useLearningStandards();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();

  const createStandard = trpc.useMutation('learningStandards.create');

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Page title={'New Standard'}>
      <Formik
        initialValues={{
          standards: standards,
          type: 'standard',
          code: '',
          description: ''
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const dependentStandards = standards.filter((standard) => standard.isChecked);
          const { standards: x, ...rest } = values;
          const mergedValues = { ...rest, dependentStandards };
          console.log(mergedValues);
          const { error } = await createStandard.mutateAsync(mergedValues);
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
            <FormControl fullWidth>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select id="type" name="type" value={values.type} label="type" onChange={handleChange}>
                <MenuItem value={'standard'}>Standard</MenuItem>
                <MenuItem value={'objective'}>Objective</MenuItem>
                <MenuItem value={'topic'}>Topic</MenuItem>
              </Select>
            </FormControl>

            <FormControl error={Boolean(touched.code && errors.code)} fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-code">Code</InputLabel>
              <OutlinedInput
                id="outlined-adornment-code"
                type="text"
                value={values.code}
                name="code"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Code"
                inputProps={{}}
              />
              {touched.code && errors.code && <FormHelperText>{errors.code}</FormHelperText>}
            </FormControl>

            <FormControl error={Boolean(touched.description && errors.description)} fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-description">Description</InputLabel>
              <OutlinedInput
                id="outlined-adornment-description"
                type="text"
                value={values.description}
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Description"
                inputProps={{}}
              />
              {touched.description && errors.description && <FormHelperText>{errors.description}</FormHelperText>}
            </FormControl>

            {values.type === 'standard' && (
              <Box>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Dependent Skills
                </Typography>
                <CodingProblemSkillChooser standards={standards} setStandards={setStandards} />
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Submit
                </Button>
              </AnimateButton>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={status?.success === true ? 'success' : 'error'} sx={{ width: '100%' }}>
                {status?.success === true ? 'Saved coding problem successfully!' : 'Error saving coding problem.'}
              </Alert>
            </Snackbar>
          </form>
        )}
      </Formik>
    </Page>
  );
};

NewStandardPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewStandardPage;

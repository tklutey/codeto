import React, { ReactElement, useState } from 'react';
import Layout from 'layout';
import CodingProblemSkillChooser from 'components/forms/components/CodingProblemSkillChooser/CodingProblemSkillChooser';
import Page from 'ui-component/Page';
import { Formik } from 'formik';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import useLearningStandards from 'hooks/useLearningStandards';
import { trpc } from 'utils/trpc';
import FormTextInput from 'components/forms/components/FormInputs/FormTextInput';
import FormSelectInput from 'components/forms/components/FormInputs/FormSelectInput';

const NewStandardPage = () => {
  const { standards, setStandards } = useLearningStandards();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const createStandard = trpc.useMutation('learningStandards.create');
  const parentStandards = [];

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
          const dependentStandards = standards.filter((standard) => standard.isChecked).map((standard) => standard.standard_id);
          const { standards: x, ...rest } = values;
          const mergedValues = { ...rest, dependentStandards };
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
            <FormSelectInput
              fieldName={'type'}
              values={values}
              selectOptions={['standard', 'objective', 'topic']}
              handleChange={handleChange}
            />

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
                <CodingProblemSkillChooser standards={standards} setStandards={setStandards} />
              </Box>
            )}

            {/*{values.type !== 'topic' && (*/}
            {/*  <Box>*/}
            {/*    <FormControl fullWidth>*/}
            {/*      <InputLabel htmlFor="parent-standard">Parent</InputLabel>*/}
            {/*      <Select id="parent-standard" name="parent-standard" value={''} label="parent-standard" onChange={handleChange}>*/}
            {/*        {parentStandards.map((s) => (*/}
            {/*          <MenuItem key={s} value={s}>*/}
            {/*            {s}*/}
            {/*          </MenuItem>*/}
            {/*        ))}*/}
            {/*      </Select>*/}
            {/*    </FormControl>*/}
            {/*  </Box>*/}
            {/*)}*/}

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
    </Page>
  );
};

NewStandardPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewStandardPage;

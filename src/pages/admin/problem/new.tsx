import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import Page from 'ui-component/Page';
import { Formik } from 'formik';
import { useTheme } from '@mui/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';

const NewProblem = () => {
  const theme = useTheme();
  const [startingCode, setStartingCode] = useState('');
  const updateStartingCode = (newCode?: string, _?: any) => {
    setStartingCode(newCode as string);
  };

  return (
    <Page title={'New Problem'}>
      <Formik
        initialValues={{
          title: '',
          description: '',
          startingCode: ''
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          console.log(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormControl error={Boolean(touched.title && errors.title)} fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-title">Title</InputLabel>
              <OutlinedInput
                id="outlined-adornment-title"
                type="text"
                value={values.title}
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Title"
                inputProps={{}}
              />
              {touched.title && errors.title && <FormHelperText>{errors.title}</FormHelperText>}
            </FormControl>

            <FormControl error={Boolean(touched.description && errors.description)} fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-description">Description</InputLabel>
              <OutlinedInput
                multiline
                id="outlined-adornment-description"
                type="text"
                value={values.description}
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Description"
                inputProps={{}}
              />
              {touched.description && errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Submit
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </Page>
  );
};

NewProblem.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewProblem;

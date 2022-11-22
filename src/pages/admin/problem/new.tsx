import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Typography } from '@mui/material';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import Page from 'ui-component/Page';
import { Formik } from 'formik';
import { useTheme } from '@mui/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
import CodeEditor from 'components/ide/editor/CodeEditor';

const NewProblem = () => {
  const theme = useTheme();
  const [startingCode, setStartingCode] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const updateStartingCode = (newCode?: string, _?: any) => {
    setStartingCode(newCode as string);
  };
  const updateSolutionCode = (newCode?: string, _?: any) => {
    setSolutionCode(newCode as string);
  };

  return (
    <Page title={'New Problem'}>
      <Formik
        initialValues={{
          title: '',
          description: ''
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const mergedValues = { ...values, startingCode, solutionCode };
          console.log(mergedValues);
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

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Starting Code
            </Typography>
            <CodeEditor language={'java'} startingCode={startingCode} updateCode={updateStartingCode} width={'900px'} height={'500px'} />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Solution Code
            </Typography>
            <CodeEditor language={'java'} startingCode={solutionCode} updateCode={updateSolutionCode} width={'900px'} height={'500px'} />

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

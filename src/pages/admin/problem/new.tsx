import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import Page from 'ui-component/Page';
import { Formik } from 'formik';
import { useTheme } from '@mui/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
import CodeEditor from 'components/ide/editor/CodeEditor';
import CodeTestInput from 'components/forms/components/CodeTestInput/CodeTestInput';

const NewProblem = () => {
  const theme = useTheme();
  const [startingCode, setStartingCode] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [sourceCodeTests, setSourceCodeTests] = useState([{ message: '', regex: '' }]);
  const [expectedOutputTests, setExpectedOutputTests] = useState([{ message: '', regex: '' }]);
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
          description: '',
          youtubeUrl: '',
          source: 'none'
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const mergedValues = { ...values, startingCode, solutionCode, sourceCodeTests, expectedOutputTests };
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

            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Tests
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Expected Output Tests
            </Typography>
            <CodeTestInput tests={expectedOutputTests} setTests={setExpectedOutputTests} regexTestText={'ababc'} />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Expected Source Code Tests
            </Typography>
            <CodeTestInput tests={sourceCodeTests} setTests={setSourceCodeTests} regexTestText={solutionCode} />

            <FormControl error={Boolean(touched.youtubeUrl && errors.youtubeUrl)} fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-youtubeUrl">YouTube URL</InputLabel>
              <OutlinedInput
                id="outlined-adornment-youtubeUrl"
                type="text"
                value={values.youtubeUrl}
                name="youtubeUrl"
                onBlur={handleBlur}
                onChange={handleChange}
                label="YouTube URL"
                inputProps={{}}
              />
              {touched.youtubeUrl && errors.youtubeUrl && <FormHelperText error>{errors.youtubeUrl}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="source">Source</InputLabel>
              <Select id="source" name="source" value={values.source} label="Source" onChange={handleChange}>
                <MenuItem value={'none'}>None</MenuItem>
                <MenuItem value={'codehs'}>CodeHS</MenuItem>
              </Select>
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

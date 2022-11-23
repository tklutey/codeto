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
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import Page from 'ui-component/Page';
import { Formik } from 'formik';
import { useTheme } from '@mui/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
import CodeEditor from 'components/ide/editor/CodeEditor';
import CodeTestInput from 'components/forms/components/CodeTestInput/CodeTestInput';
import IDE from 'components/ide';
import { trpc } from 'utils/trpc';

const NewProblem = () => {
  const theme = useTheme();
  const [startingCode, setStartingCode] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [solutionCodeTerminalText, setSolutionCodeTerminalText] = useState('');
  const [sourceCodeTests, setSourceCodeTests] = useState([{ message: '', regex: '' }]);
  const [expectedOutputTests, setExpectedOutputTests] = useState([{ message: '', regex: '' }]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const updateStartingCode = (newCode?: string, _?: any) => {
    setStartingCode(newCode as string);
  };
  const updateSolutionCode = (newCode?: string, _?: any) => {
    setSolutionCode(newCode as string);
  };
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const createProblem = trpc.useMutation('codingProblem.create');

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
          const { error } = await createProblem.mutateAsync(mergedValues);
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
            <div style={{ height: '700px', width: '1100px' }}>
              <IDE
                width={'100%'}
                height={'100%'}
                language={'java'}
                startingCode={startingCode}
                setIsProblemComplete={() => {}}
                userCode={solutionCode}
                setUserCode={updateSolutionCode}
                registerResetEventHandler={() => {}}
                onTerminalTextChange={setSolutionCodeTerminalText}
              />
            </div>

            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Tests
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Expected Output Tests
            </Typography>
            <CodeTestInput tests={expectedOutputTests} setTests={setExpectedOutputTests} regexTestText={solutionCodeTerminalText} />
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

NewProblem.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewProblem;

import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import Layout from 'layout';
import { ReactElement, useState } from 'react';
import Page from 'ui-component/Page';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import CodeEditor from 'components/ide/editor/CodeEditor';
import CodeTestInput from 'components/forms/components/CodeTestInput/CodeTestInput';
import IDE from 'components/ide';
import { trpc } from 'utils/trpc';
import CodingProblemSkillChooser from 'components/forms/components/CodingProblemSkillChooser/CodingProblemSkillChooser';
import FormTextInput from 'components/forms/components/FormInputs/FormTextInput';
import FormSelectInput from 'components/forms/components/FormInputs/FormSelectInput';
import useLearningStandards from 'hooks/useLearningStandards';

const NewProblem = () => {
  const { standards, setStandards } = useLearningStandards();
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
          source: 'none',
          standards: standards,
          submit: null
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const dependentStandards = standards.filter((standard) => standard.isChecked).map((standard) => standard.standard_id);
          const mergedValues = {
            ...values,
            startingCode,
            solutionCode,
            sourceCodeTests,
            expectedOutputTests,
            dependentStandards
          };
          const handleError = () => {
            setStatus({ success: false });
            setSubmitting(false);
            setSnackbarOpen(true);
          };
          const handleSuccess = () => {
            setStatus({ success: true });
            setSubmitting(false);
            setSnackbarOpen(true);
          };
          try {
            const { error } = await createProblem.mutateAsync(mergedValues);
            if (!error) {
              handleSuccess();
            } else {
              handleError();
            }
          } catch (error) {
            handleError();
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, status, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormTextInput
              fieldName={'title'}
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

            <FormTextInput
              fieldName={'youtubeUrl'}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />

            <FormSelectInput fieldName={'source'} values={values} selectOptions={['none', 'codehs']} handleChange={handleChange} />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Associated Skills
            </Typography>
            <CodingProblemSkillChooser standards={standards} setStandards={setStandards} />
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

import { Alert, Box, Button, Typography } from '@mui/material';
import ThemedDiffEditor from 'components/ide/editor/ThemedDiffEditor';
import React, { useState } from 'react';
import { useTheme } from '@mui/styles';

const AssignmentWalkthrough = ({ handleTestCode, solutionCode, language, userCode, setUserCode }: Props) => {
  const [isUserCodeCorrect, setIsUserCodeCorrect] = useState(false);
  const theme = useTheme();

  const updateCode = (newCode?: string, _?: any) => {
    if (newCode !== undefined) {
      setUserCode(newCode);
      if (newCode === solutionCode) {
        setIsUserCodeCorrect(true);
      } else {
        setIsUserCodeCorrect(false);
      }
    }
  };
  return (
    <Box height={'100%'}>
      <Alert severity="info" sx={{ marginY: '10px' }}>
        Modify your code on the right to match the solution code.
      </Alert>
      <Box sx={{ display: 'flex', paddingBottom: '10px' }}>
        <Box sx={{ width: '50%' }}>
          <Typography variant="h4">Solution</Typography>
        </Box>
        <Box sx={{ width: '50%' }}>
          <Typography variant="h4">Your Code</Typography>
        </Box>
      </Box>
      <ThemedDiffEditor language={language} originalCode={solutionCode} modifiedCode={userCode} updateCode={updateCode} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          disabled={!isUserCodeCorrect}
          sx={{
            marginTop: '8px',
            color: theme.palette.common.black,
            background: theme.palette.warning.dark,
            '&:hover': { background: theme.palette.warning.main }
          }}
          onClick={handleTestCode}
        >
          Test Your Solution
        </Button>
      </Box>
    </Box>
  );
};

type Props = {
  handleTestCode: () => void;
  solutionCode: string;
  language: string;
  userCode?: string;
  setUserCode: (code: string) => void;
};
export default AssignmentWalkthrough;

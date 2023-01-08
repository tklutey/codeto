import Question from './Question';
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/styles';
import { trpc } from '../../utils/trpc';
import useAuth from '../../hooks/useAuth';
import FooterStrip from '../footer/FooterStrip';

const Test = ({ unitNum }: Props) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  const [assessmentState, setAssessmentState] = useState<any>(null);
  trpc.useQuery(['assessmentEngine.getAssessmentState', JSON.stringify({ userId: user.id, unitNum: unitNum, prevProblemIndex: 1 })], {
    onSuccess: (data) => {
      if (data) {
        setProblem(data.currentProblem);
        setAssessmentState(data);
      }
    }
  });
  return (
    <Box>
      {assessmentState && (
        <Question
          prompt={assessmentState.currentProblem.prompt}
          answerOptions={assessmentState.currentProblem.answerOptions}
          setIsAnswerSelected={setIsAnswerSelected}
        />
      )}
      <FooterStrip>
        <Box>{`Question ${assessmentState?.problemsCompleted} of ${assessmentState?.totalProblems}`}</Box>
        <Button
          variant="contained"
          disabled={!isAnswerSelected}
          sx={{
            margin: '14px',
            color: theme.palette.common.black,
            background: theme.palette.warning.dark,
            '&:hover': { background: theme.palette.warning.main }
          }}
        >
          Submit
        </Button>
      </FooterStrip>
    </Box>
  );
};

type Props = {
  unitNum: number;
};
export default Test;

import Question from './Question';
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/styles';
import { trpc } from '../../utils/trpc';
import useAuth from '../../hooks/useAuth';
import FooterStrip from '../footer/FooterStrip';
import BackToDashboardModal from '../assignment/BackToDashboardModal';

const Test = ({ unitNum }: Props) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [assessmentState, setAssessmentState] = useState<any>(null);
  const [problemSequence, setProblemSequence] = useState(0);
  trpc.useQuery(
    ['assessmentEngine.getAssessmentState', JSON.stringify({ userId: user?.id, unitNum: unitNum, problemSequence: problemSequence })],
    {
      onSuccess: (data) => {
        if (data) {
          setAssessmentState(data);
        }
      }
    }
  );
  return (
    <Box>
      {assessmentState && assessmentState.status === 'IN_PROGRESS' && (
        <Question
          prompt={assessmentState.currentProblem.prompt}
          answerOptions={assessmentState.currentProblem.answerOptions}
          setIsAnswerSelected={setIsAnswerSelected}
        />
      )}
      {assessmentState && assessmentState.status === 'COMPLETE' && (
        <BackToDashboardModal title={'Assessment Complete!'} body={'Head back to the dashboard to see what you mastered.'} />
      )}
      <FooterStrip>
        <Box>
          {assessmentState &&
            assessmentState.status === 'IN_PROGRESS' &&
            `Question ${assessmentState?.problemsCompleted} of ${assessmentState?.totalProblems}`}
        </Box>
        <Button
          variant="contained"
          disabled={!isAnswerSelected}
          sx={{
            margin: '14px',
            color: theme.palette.common.black,
            background: theme.palette.warning.dark,
            '&:hover': { background: theme.palette.warning.main }
          }}
          onClick={() => setProblemSequence((prevProblemIndex) => prevProblemIndex + 1)}
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

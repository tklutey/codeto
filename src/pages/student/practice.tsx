import React, { ReactElement, useEffect, useState } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';
import { ExerciseTests } from 'server/routers/codingProblem';
import { openDrawer } from 'store/slices/menu';
import { dispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';

const Practice = () => {
  const { user } = useAuth();
  if (!user || !user.id) {
    throw new Error('User not found');
  }
  const { drawerOpen } = useSelector((state) => state.menu);
  const [codingProblemId, setCodingProblemId] = useState(1);
  const lesson = trpc.useQuery(['codingProblem.getById', codingProblemId]);
  const updateKnowledgeStateMutation = trpc.useMutation('knowledgeState.update');
  useEffect(() => {
    if (drawerOpen) {
      dispatch(openDrawer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToNextProblem = (learningStandards: number[]) => {
    return () => {
      const input = {
        learningStandards,
        userId: user.id
      };
      // @ts-ignore
      const data = updateKnowledgeStateMutation.mutate(input);
      // TODO: Make this an API call
      const MAX_PROBLEM_ID = 6;
      let nextProblemId = codingProblemId + 1;
      if (nextProblemId > MAX_PROBLEM_ID) {
        nextProblemId = nextProblemId % MAX_PROBLEM_ID;
      }
      setCodingProblemId(nextProblemId);
    };
  };

  if (lesson?.data) {
    const {
      title: assignmentTitle,
      description: assignmentDescription,
      language: language,
      starting_code: startingCode,
      youtube_tutorial_url: youtubeTutorialUrl,
      solution_code: solutionCode,
      learning_standards: learningStandards,
      tests
    } = lesson.data;
    return (
      <ProgrammingActivityLayout
        assignmentTitle={assignmentTitle}
        assignmentDescription={assignmentDescription}
        language={language}
        startingCode={startingCode}
        solutionCode={solutionCode}
        tests={tests as ExerciseTests}
        youtubeTutorialUrl={youtubeTutorialUrl}
        goToNextProblem={goToNextProblem(learningStandards)}
      />
    );
  }
  return <div>Loading...</div>;
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

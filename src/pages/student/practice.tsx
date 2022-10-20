import React, { ReactElement, useEffect, useState } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';
import { ExerciseTests } from 'server/routers/codingProblem';
import { openDrawer } from 'store/slices/menu';
import { dispatch, useSelector } from 'store';

const Practice = () => {
  const { drawerOpen } = useSelector((state) => state.menu);
  const [codingProblemId, setCodingProblemId] = useState(1);
  useEffect(() => {
    if (drawerOpen) {
      dispatch(openDrawer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToNextProblem = () => {
    // TODO: Make this an API call
    const MAX_PROBLEM_ID = 6;
    let nextProblemId = codingProblemId + 1;
    if (nextProblemId > MAX_PROBLEM_ID) {
      nextProblemId = nextProblemId % MAX_PROBLEM_ID;
    }
    setCodingProblemId(nextProblemId);
  };

  const lesson = trpc.useQuery(['codingProblem.getById', codingProblemId]);
  if (lesson?.data) {
    const {
      title: assignmentTitle,
      description: assignmentDescription,
      language: language,
      starting_code: startingCode,
      youtube_tutorial_url: youtubeTutorialUrl,
      solution_code: solutionCode,
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
        goToNextProblem={goToNextProblem}
      />
    );
  }
  return <div>Loading...</div>;
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

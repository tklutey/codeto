import { dispatch, useSelector } from 'store';
import React, { ReactElement, useEffect } from 'react';
import { openDrawer } from 'store/slices/menu';
import { trpc } from 'utils/trpc';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { ExerciseTests } from 'server/routers/codingProblem';
import Layout from 'layout';
import { useRouter } from 'next/router';

const Problem = () => {
  const router = useRouter();
  const { id } = router.query;
  const { drawerOpen } = useSelector((state) => state.menu);
  useEffect(() => {
    if (drawerOpen) {
      dispatch(openDrawer(false));
    }
  }, []);

  const lesson = trpc.useQuery(['codingProblem.get', Number(id)]);
  if (lesson?.data) {
    const {
      title: assignmentTitle,
      description: assignmentDescription,
      language: language,
      starting_code: startingCode,
      youtube_tutorial_url: youtubeTutorialUrl,
      tests
    } = lesson.data;
    return (
      <ProgrammingActivityLayout
        assignmentTitle={assignmentTitle}
        assignmentDescription={assignmentDescription}
        language={language}
        startingCode={startingCode}
        tests={tests as ExerciseTests}
        youtubeTutorialUrl={youtubeTutorialUrl}
      />
    );
  }
  return <div>Loading...</div>;
};

Problem.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Problem;
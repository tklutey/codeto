import React, { ReactElement } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';
import { ExerciseTests } from 'server/routers/codingProblem';

const Practice = () => {
  const lesson = trpc.useQuery(['codingProblem.get']);
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
        expectedOutput={''}
        tests={tests as ExerciseTests}
        youtubeTutorialUrl={youtubeTutorialUrl}
      />
    );
  }
  return <div>Loading...</div>;
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

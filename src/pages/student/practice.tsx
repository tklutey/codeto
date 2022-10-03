import React, { ReactElement } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';

const Practice = () => {
  const lesson = trpc.useQuery(['lesson.get']);
  if (lesson?.data) {
    const { assignmentTitle, assignmentDescription, language, startingCode, expectedOutput, tests } = lesson.data;
    return (
      <ProgrammingActivityLayout
        assignmentTitle={assignmentTitle}
        assignmentDescription={assignmentDescription}
        language={language}
        startingCode={startingCode}
        expectedOutput={expectedOutput}
        tests={tests}
      />
    );
  }
  return <div>Loading...</div>;
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

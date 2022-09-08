import React, { ReactElement } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';

const mockApiCall = () => {
  return {
    assignmentTitle: 'Linked List',
    assignmentDescription: 'Make a linked list',
    language: 'python',
    startingCode: `print('hello world')`
  };
};
const Practice = () => {
  const { assignmentTitle, assignmentDescription, language, startingCode } = mockApiCall();
  return (
    <ProgrammingActivityLayout
      assignmentTitle={assignmentTitle}
      assignmentDescription={assignmentDescription}
      language={language}
      startingCode={startingCode}
    />
  );
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

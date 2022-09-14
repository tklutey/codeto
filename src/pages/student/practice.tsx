import React, { ReactElement } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';

const getNextLearningExercise = () => {
  return {
    assignmentTitle: 'Hello World',
    assignmentDescription: 'Write a program that prints "Hello World" to the console.',
    language: 'java',
    startingCode: `
public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}
    `,
    expectedOutput: 'Hello, World'
  };
};
const Practice = () => {
  const lesson = trpc.useQuery(['lesson.get']);
  if (lesson?.data) {
    const { assignmentTitle, assignmentDescription, language, startingCode, expectedOutput } = lesson.data;
    return (
      <ProgrammingActivityLayout
        assignmentTitle={assignmentTitle}
        assignmentDescription={assignmentDescription}
        language={language}
        startingCode={startingCode}
        expectedOutput={expectedOutput}
      />
    );
  }
  return <div>Loading...</div>;
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

import IDE from 'components/ide';
import React from 'react';
import { ExerciseTests } from 'server/routers/lesson';

const ProgrammingActivityLayout = (props: Props) => {
  const { assignmentTitle, assignmentDescription, language, startingCode, expectedOutput, tests } = props;
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '20%', display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', paddingTop: '55px' }}>
        <h1> {assignmentTitle} </h1>
        <p> {assignmentDescription} </p>
      </div>
      <IDE width={'80%'} height={'100%'} language={language} startingCode={startingCode} expectedOutput={expectedOutput} tests={tests} />
    </div>
  );
};

type Props = {
  assignmentTitle: string;
  assignmentDescription: string;
  language: string;
  startingCode?: string;
  expectedOutput: string;
  tests?: ExerciseTests;
};

export default ProgrammingActivityLayout;

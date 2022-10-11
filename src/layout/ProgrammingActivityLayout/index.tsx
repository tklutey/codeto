import IDE from 'components/ide';
import React from 'react';
import { ExerciseTests } from 'server/routers/codingProblem';
import AssignmentSidebar from 'components/assignment/AssignmentSidebar';
import AssignmentFooter from 'components/assignment/AssignmentFooter';

const ProgrammingActivityLayout = (props: Props) => {
  const { assignmentTitle, assignmentDescription, language, startingCode, tests, youtubeTutorialUrl } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
        <AssignmentSidebar
          assignmentTitle={assignmentTitle}
          assignmentDescription={assignmentDescription}
          youtubeTutorialUrl={youtubeTutorialUrl}
        />
        <IDE width={'80%'} height={'90%'} language={language} startingCode={startingCode} tests={tests} />
      </div>
      <AssignmentFooter />
    </div>
  );
};

type Props = {
  assignmentTitle: string;
  assignmentDescription: string;
  language: string;
  startingCode?: string;
  tests?: ExerciseTests;
  youtubeTutorialUrl?: string;
};

export default ProgrammingActivityLayout;

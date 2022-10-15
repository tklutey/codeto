import IDE from 'components/ide';
import React, { useState } from 'react';
import { ExerciseTests } from 'server/routers/codingProblem';
import AssignmentSidebar from 'components/assignment/AssignmentSidebar';
import AssignmentFooter from 'components/assignment/AssignmentFooter';

const ProgrammingActivityLayout = (props: Props) => {
  const { assignmentTitle, assignmentDescription, language, startingCode, tests, youtubeTutorialUrl, goToNextProblem } = props;
  const [canMoveOnToNextProblem, setCanMoveOnToNextProblem] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div style={{ height: '90%', width: '100%', display: 'flex', alignItems: 'flex-start' }}>
        <AssignmentSidebar
          assignmentTitle={assignmentTitle}
          assignmentDescription={assignmentDescription}
          youtubeTutorialUrl={youtubeTutorialUrl}
          width={'20%'}
          height={'100%'}
        />
        <IDE
          width={'80%'}
          height={'100%'}
          language={language}
          startingCode={startingCode}
          tests={tests}
          setIsProblemComplete={setCanMoveOnToNextProblem}
        />
      </div>
      <AssignmentFooter disabled={!canMoveOnToNextProblem} goToNextProblem={goToNextProblem} />
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
  goToNextProblem?: () => void;
};

export default ProgrammingActivityLayout;

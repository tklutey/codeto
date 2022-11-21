import IDE from 'components/ide';
import React, { useEffect, useState } from 'react';
import { ExerciseTests } from 'server/routers/codingProblem';
import AssignmentSidebar from 'components/assignment/AssignmentSidebar';
import AssignmentFooter from 'components/assignment/AssignmentFooter';
import SolutionModal from 'components/assignment/SolutionModal';

const ProgrammingActivityLayout = (props: Props) => {
  const {
    assignmentTitle,
    assignmentDescription,
    language,
    startingCode,
    solutionCode,
    tests,
    youtubeTutorialUrl,
    goToNextProblem,
    isLoading
  } = props;
  const [canMoveOnToNextProblem, setCanMoveOnToNextProblem] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState<string | undefined>(startingCode);
  const [isProblemCorrect, setIsProblemCorrect] = useState(true);
  const [resetEventHandlers, setResetEventHandlers] = useState<(() => void)[]>([]);

  useEffect(() => {
    setUserCode(startingCode);
  }, [startingCode]);

  const handleShowSolution = () => {
    setShowSolution(true);
    setIsProblemCorrect(false);
  };

  const handleGoToNextProblem = () => {
    goToNextProblem(isProblemCorrect)();
    console.log(resetEventHandlers);
    resetEventHandlers.forEach((handler) => handler());
  };

  const registerResetEventHandler = (handler: () => void) => {
    setResetEventHandlers((prevResetEventHandlers) => {
      console.log('registering reset event handler: ', handler);
      console.log('pre-existing reset event handlers: ', prevResetEventHandlers);
      return [...prevResetEventHandlers, handler];
    });
  };

  useEffect(() => {
    registerResetEventHandler(() => setUserCode(''));
    registerResetEventHandler(() => setCanMoveOnToNextProblem(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div style={{ height: '90%', width: '100%', display: 'flex', alignItems: 'flex-start' }}>
        <SolutionModal
          isOpen={showSolution}
          handleClose={() => setShowSolution(false)}
          language={language}
          solutionCode={solutionCode ? solutionCode : 'No solution provided.'}
          userCode={userCode}
          setUserCode={setUserCode}
        />
        <AssignmentSidebar
          assignmentTitle={assignmentTitle}
          assignmentDescription={assignmentDescription}
          youtubeTutorialUrl={youtubeTutorialUrl}
          width={'20%'}
          height={'100%'}
          isLoading={isLoading}
        />
        <IDE
          width={'80%'}
          height={'100%'}
          language={language}
          startingCode={startingCode}
          tests={tests}
          setIsProblemComplete={setCanMoveOnToNextProblem}
          userCode={userCode}
          setUserCode={setUserCode}
          registerResetEventHandler={registerResetEventHandler}
        />
      </div>
      <AssignmentFooter
        disabled={!canMoveOnToNextProblem}
        onNextClicked={handleGoToNextProblem}
        onShowSolutionClicked={handleShowSolution}
      />
    </div>
  );
};

type Props = {
  assignmentTitle: string;
  assignmentDescription: string;
  language: string;
  startingCode?: string;
  solutionCode?: string;
  tests?: ExerciseTests;
  youtubeTutorialUrl?: string;
  goToNextProblem: (isCorrect: boolean) => () => void;
  isLoading: boolean;
};

export default ProgrammingActivityLayout;

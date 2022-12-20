import IDE from 'components/ide';
import React, { useEffect, useState } from 'react';
import { CodingProblemTest } from 'server/routers/codingProblem';
import AssignmentSidebar from 'components/assignment/AssignmentSidebar';
import AssignmentFooter from 'components/assignment/AssignmentFooter';
import SolutionModal from 'components/assignment/SolutionModal';
import { MasteryStatus } from 'server/types';
import { getScaffoldingConfiguration, ScaffoldingConfiguration } from 'layout/ProgrammingActivityLayout/scaffolding';

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
    isLoading,
    problemFetchTimestamp,
    masteryStatus
  } = props;
  const [canMoveOnToNextProblem, setCanMoveOnToNextProblem] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState<string | undefined>(startingCode);
  const [isProblemCorrect, setIsProblemCorrect] = useState(true);
  const [resetEventHandlers, setResetEventHandlers] = useState<(() => void)[]>([]);
  const scaffoldingConfiguration: ScaffoldingConfiguration | undefined = masteryStatus
    ? getScaffoldingConfiguration(masteryStatus)
    : undefined;

  useEffect(() => {
    setUserCode(startingCode);
    setIsProblemCorrect(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemFetchTimestamp]);

  const handleShowSolution = () => {
    setShowSolution(true);
  };

  const cleanupProblem = () => {
    resetEventHandlers.forEach((handler) => handler());
  };

  // @TODO: make sure mastery stages work with skipping/incorrect
  const handleProblemComplete = (correct: boolean) => {
    if (goToNextProblem) {
      goToNextProblem(correct);
      cleanupProblem();
    }
  };

  const handleGoToNextProblem = () => {
    handleProblemComplete(isProblemCorrect);
  };

  const registerResetEventHandler = (handler: () => void) => {
    setResetEventHandlers((prevResetEventHandlers) => {
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
          testLimit={scaffoldingConfiguration ? scaffoldingConfiguration.testLimit : undefined}
          onProblemComplete={handleProblemComplete}
        />
      </div>
      <AssignmentFooter
        disabled={!canMoveOnToNextProblem}
        onNextClicked={handleGoToNextProblem}
        onSkipClicked={() => handleProblemComplete(false)}
        onShowSolutionClicked={handleShowSolution}
        masteryStatus={masteryStatus}
        allowShowSolution={scaffoldingConfiguration ? scaffoldingConfiguration.hasSolution : true}
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
  tests?: CodingProblemTest[];
  youtubeTutorialUrl?: string;
  goToNextProblem?: (isCorrect: boolean) => Promise<void>;
  isLoading: boolean;
  problemFetchTimestamp?: number;
  masteryStatus?: MasteryStatus;
};

export default ProgrammingActivityLayout;

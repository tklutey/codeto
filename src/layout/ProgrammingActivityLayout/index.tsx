import IDE from 'components/ide';
import React, { useEffect, useState } from 'react';
import { CodingProblemTest } from 'server/routers/codingProblem';
import AssignmentSidebar from 'components/assignment/AssignmentSidebar';
import AssignmentFooter from 'components/assignment/AssignmentFooter';
import { MasteryStatus, ProblemAttemptStatus } from 'server/types';
import { getScaffoldingConfiguration, ScaffoldingConfiguration } from 'layout/ProgrammingActivityLayout/scaffolding';
import { Alert, Snackbar } from '@mui/material';
import useSnackbar from 'hooks/useSnackbar';
import GetUnstuckModal from 'components/assignment/GetUnstuckModal';

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
    currentProblemMasteryStatus,
    submittedProblemMasteryStatus,
    isAdaptiveMode
  } = props;
  const [canMoveOnToNextProblem, setCanMoveOnToNextProblem] = useState(false);
  const [showGetUnstuckModal, setShowGetUnstuckModal] = useState(false);
  const [userCode, setUserCode] = useState<string | undefined>(startingCode);
  const [problemAttemptStatus, setProblemAttemptStatus] = useState<ProblemAttemptStatus>(ProblemAttemptStatus.Correct);
  const [resetEventHandlers, setResetEventHandlers] = useState<(() => void)[]>([]);
  const scaffoldingConfiguration: ScaffoldingConfiguration | undefined =
    currentProblemMasteryStatus !== null && currentProblemMasteryStatus !== undefined
      ? getScaffoldingConfiguration(currentProblemMasteryStatus)
      : undefined;
  useSnackbar();
  const { isSnackbarOpen: masteredProblemSnackbarOpen, setIsSnackbarOpen: setMasteredProblemSnackbarOpen, handleClose } = useSnackbar();

  useEffect(() => {
    if (submittedProblemMasteryStatus === MasteryStatus.Mastered) {
      setMasteredProblemSnackbarOpen(true);
    }
  }, [submittedProblemMasteryStatus, setMasteredProblemSnackbarOpen]);

  useEffect(() => {
    setUserCode(startingCode);
    setProblemAttemptStatus(ProblemAttemptStatus.Correct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemFetchTimestamp]);

  const cleanupProblem = () => {
    resetEventHandlers.forEach((handler) => handler());
  };

  const handleProblemComplete = (inputProblemAttemptStatus: ProblemAttemptStatus) => {
    if (goToNextProblem) {
      goToNextProblem(inputProblemAttemptStatus);
      cleanupProblem();
    }
  };

  const handleGoToNextProblem = () => {
    handleProblemComplete(problemAttemptStatus);
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div style={{ height: '90%', width: '100%', display: 'flex', alignItems: 'flex-start' }}>
        <GetUnstuckModal
          isOpen={showGetUnstuckModal}
          handleClose={() => setShowGetUnstuckModal(false)}
          youtubeTutorialUrl={youtubeTutorialUrl}
          language={language}
          solutionCode={solutionCode ? solutionCode : 'No solution provided.'}
          userCode={userCode}
          setUserCode={setUserCode}
          scaffoldingConfiguration={scaffoldingConfiguration}
          setProblemSkipped={() => setProblemAttemptStatus(ProblemAttemptStatus.Skipped)}
        />
        <AssignmentSidebar
          assignmentTitle={assignmentTitle}
          assignmentDescription={assignmentDescription}
          width={'20%'}
          height={'100%'}
          isLoading={isLoading}
          hasGetUnstuck={
            scaffoldingConfiguration
              ? scaffoldingConfiguration.hasSolution || scaffoldingConfiguration.hasChat || scaffoldingConfiguration.hasVideo
              : true
          }
          setShowGetUnstuckModal={setShowGetUnstuckModal}
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
          isLoading={isLoading}
        />
      </div>

      <Snackbar open={masteredProblemSnackbarOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={'success'} sx={{ width: '100%' }}>
          {'Skill Mastered'}
        </Alert>
      </Snackbar>
      <AssignmentFooter
        disabled={!canMoveOnToNextProblem}
        onNextClicked={handleGoToNextProblem}
        onSkipClicked={() => handleProblemComplete(ProblemAttemptStatus.Skipped)}
        masteryStatus={currentProblemMasteryStatus}
        isAdaptiveMode={isAdaptiveMode}
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
  goToNextProblem?: (problemAttemptStatus: ProblemAttemptStatus) => Promise<void>;
  isLoading: boolean;
  problemFetchTimestamp?: number;
  currentProblemMasteryStatus?: MasteryStatus;
  submittedProblemMasteryStatus?: MasteryStatus;
  isAdaptiveMode?: boolean;
};

export default ProgrammingActivityLayout;

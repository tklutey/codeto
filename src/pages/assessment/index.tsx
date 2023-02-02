import { dispatch, useSelector } from 'store';
import React, { ReactElement, useEffect, useState } from 'react';
import { openDrawer } from 'store/slices/menu';
import { trpc } from 'utils/trpc';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import Layout from 'layout';
import Page from 'ui-component/Page';
import { CodingProblemTest } from 'server/routers/codingProblem';
import AssessmentFooter from '../../components/assessment/AssessmentFooter';
import useModal from '../../hooks/useModal';
import AssessmentIntroModal from '../../components/assessment/AssessmentIntroModal';
import useAuth from '../../hooks/useAuth';
import { ProblemAttemptStatus } from '../../server/types';
import AssignmentsCompleteModal from '../../components/assignment/BackToDashboardModal';

const Problem = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [codingProblem, setCodingProblem] = useState<any>(null);
  const [problemFetchTimestamp, setProblemFetchTimestamp] = useState<number>(0);
  const [isAllProblemsComplete, setIsAllProblemsComplete] = useState(false);
  if (!user || !user.id) {
    throw new Error('User not found');
  }
  const { drawerOpen } = useSelector((state) => state.menu);
  const { isOpen, closeModal } = useModal(false);
  useEffect(() => {
    if (drawerOpen) {
      dispatch(openDrawer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { refetch: refetchProblemsByDistance } = trpc.useQuery(
    [
      'engine.getProblemsByDistance',
      JSON.stringify({
        userId: user.id,
        courseId: 2,
        order: 'desc'
      })
    ],
    {
      onSuccess: (data) => {
        if (data) {
          if (data.length > 0) {
            const prob = data[0];
            setCodingProblem(prob);
            setProblemFetchTimestamp(Date.now());
          } else {
            setIsAllProblemsComplete(true);
          }
          setIsLoading(false);
        }
      },
      refetchOnWindowFocus: false
    }
  );

  const submitProblemAttempt = trpc.useMutation('userProblem.submitProblemAttempt');

  const goToNextProblem = async (problemAttemptStatus: ProblemAttemptStatus) => {
    setIsLoading(true);
    const data = await submitProblemAttempt.mutateAsync({
      userId: user.id as string,
      codingProblemId: codingProblem.id,
      problemAttemptStatus
    });
    await refetchProblemsByDistance();
  };

  const getPageContent = (problem: any) => {
    if (isAllProblemsComplete) {
      return (
        <AssignmentsCompleteModal
          title={'Mastery Achieved!'}
          body={"You've mastered all of the skills in this unit. Head to the dashboard to see your progress."}
        />
      );
    } else if (problem) {
      const {
        title: assignmentTitle,
        description: assignmentDescription,
        language: language,
        starting_code: startingCode,
        youtube_tutorial_url: youtubeTutorialUrl,
        solution_code: solutionCode,
        coding_problem_tests: codingProblemTests
      } = problem;
      return (
        <>
          <AssessmentIntroModal isOpen={isOpen} handleClose={closeModal} />
          <ProgrammingActivityLayout
            assignmentTitle={assignmentTitle}
            assignmentDescription={assignmentDescription}
            language={language}
            startingCode={startingCode}
            solutionCode={solutionCode}
            tests={codingProblemTests as CodingProblemTest[]}
            youtubeTutorialUrl={youtubeTutorialUrl}
            isLoading={isLoading}
            showGetUnstuckButton={false}
            footer={<AssessmentFooter disabled={true} onNextClicked={() => console.log('click')} />}
            problemFetchTimestamp={problemFetchTimestamp}
            goToNextProblem={(problemAttemptStatus: ProblemAttemptStatus) => goToNextProblem(problemAttemptStatus)}
          />
        </>
      );
    }
    return <div>Loading...</div>;
  };

  return <Page title="Practice">{getPageContent(codingProblem)}</Page>;
};

Problem.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Problem;

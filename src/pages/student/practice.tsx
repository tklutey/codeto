import React, { ReactElement, useState } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';
import useAuth from 'hooks/useAuth';
import Page from 'ui-component/Page';
import useOpenNavDrawer from 'hooks/useOpenNavDrawer';
import AssignmentsCompleteModal from 'components/assignment/AssignmentsCompleteModal';
import { CodingProblemTest } from 'server/routers/codingProblem';
import { getMasteryStatusByKey, MasteryStatus } from 'server/types';

const Practice = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useOpenNavDrawer();
  const [codingProblem, setCodingProblem] = useState<any>(null);
  const [masteryStatus, setMasteryStatus] = useState<MasteryStatus>(MasteryStatus.Unattempted);
  const [problemFetchTimestamp, setProblemFetchTimestamp] = useState<number>(0);
  const [isAllProblemsComplete, setIsAllProblemsComplete] = useState(false);
  if (!user || !user.id) {
    throw new Error('User not found');
  }

  const { refetch: refetchProblemsByDistance } = trpc.useQuery(
    [
      'engine.getProblemSetsByDistance',
      JSON.stringify({
        userId: user.id
      })
    ],
    {
      onSuccess: (data) => {
        if (data) {
          if (data.length > 0) {
            const masteryStatusKey = data[0].mastery_status;
            setMasteryStatus(getMasteryStatusByKey(masteryStatusKey));
            const prob = data[0].coding_problems[0];
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

  const goToNextProblem = async (isCorrect: boolean) => {
    setIsLoading(true);
    await submitProblemAttempt.mutateAsync({
      userId: user.id as string,
      codingProblemId: codingProblem.id,
      isCorrect
    });
    await refetchProblemsByDistance();
  };

  // get mastery status index

  const getPageContent = (problem: any) => {
    if (isAllProblemsComplete) {
      return <AssignmentsCompleteModal />;
    } else if (problem) {
      const {
        title: assignmentTitle,
        description: assignmentDescription,
        language: language,
        starting_code: startingCode,
        youtube_tutorial_url: youtubeTutorialUrl,
        solution_code: solutionCode,
        learning_standards: learningStandards,
        coding_problem_tests: codingProblemTests
      } = problem;
      return (
        <ProgrammingActivityLayout
          assignmentTitle={assignmentTitle}
          assignmentDescription={assignmentDescription}
          language={language}
          startingCode={startingCode}
          solutionCode={solutionCode}
          tests={codingProblemTests as CodingProblemTest[]}
          youtubeTutorialUrl={youtubeTutorialUrl}
          goToNextProblem={(isCorrect: boolean) => goToNextProblem(isCorrect)}
          isLoading={isLoading}
          problemFetchTimestamp={problemFetchTimestamp}
          masteryStatus={masteryStatus}
        />
      );
    }
    return <div>Loading...</div>;
  };

  return <Page title="Practice">{getPageContent(codingProblem)}</Page>;
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

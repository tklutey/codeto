import React, { ReactElement, useState } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';
import useAuth from 'hooks/useAuth';
import Page from 'ui-component/Page';
import useOpenNavDrawer from 'hooks/useOpenNavDrawer';
import AssignmentsCompleteModal from 'components/assignment/AssignmentsCompleteModal';
import { CodingProblemTest } from 'server/routers/codingProblem';

const extractKnowledgeState = (masteredLearningStandards: any[]): number[] => {
  return masteredLearningStandards.map((mls) => mls.learning_standard_id);
};

const Practice = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useOpenNavDrawer();
  const [codingProblem, setCodingProblem] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [problemFetchTimestamp, setProblemFetchTimestamp] = useState<number>(0);
  const [isAllProblemsComplete, setIsAllProblemsComplete] = useState(false);
  if (!user || !user.id) {
    throw new Error('User not found');
  }
  const [knowledgeState, setKnowledgeState] = useState<number[]>([]);
  const { refetch: refetchMasteredLearningStandards } = trpc.useQuery(['knowledgeState.getMasteredLearningStandards', user.id], {
    onSuccess: (data) => {
      if (data) {
        setKnowledgeState(extractKnowledgeState(data));
      }
    }
  });
  const { refetch: refetchProblemsByDistance } = trpc.useQuery(
    [
      'engine.getProblemSetsByDistance',
      JSON.stringify({
        learningStandards: knowledgeState,
        userId: user.id
      })
    ],
    {
      onSuccess: (data) => {
        if (data) {
          if (data.length > 0) {
            setStreak(data[0].streak);
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

  const updateKnowledgeStateMutation = trpc.useMutation('knowledgeState.update');
  const updateProblemAttemptHistory = trpc.useMutation('codingProblem.updateProblemAttemptHistory');

  const goToNextProblem = (isCorrect: boolean) => {
    return (learningStandards: any[]) => {
      return async () => {
        setIsLoading(true);
        await updateProblemAttemptHistory.mutateAsync({
          userId: user.id as string,
          problemId: codingProblem?.id,
          isCorrect
        });
        // @TODO: Combine update problem attempt history and update knowledge state api so the back end determines when the user has mastered a learning standard
        if (isCorrect && streak === 1) {
          const learningStandardsNumeric = learningStandards.map((ls) => ls.standard_id);
          await updateKnowledgeStateMutation.mutateAsync({
            learningStandards: learningStandardsNumeric,
            userId: user.id as string
          });
          const { data: updatedMasteredLearningStandards } = await refetchMasteredLearningStandards();
          setKnowledgeState(extractKnowledgeState(updatedMasteredLearningStandards || []));
        } else {
          await refetchProblemsByDistance();
        }
      };
    };
  };

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
          goToNextProblem={(isCorrect: boolean) => goToNextProblem(isCorrect)(learningStandards)}
          isLoading={isLoading}
          problemFetchTimestamp={problemFetchTimestamp}
          problemSetStageIndex={streak}
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

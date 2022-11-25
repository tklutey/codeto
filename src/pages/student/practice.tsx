import React, { ReactElement, useState } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';
import { ExerciseTests } from 'server/routers/codingProblem';
import useAuth from 'hooks/useAuth';
import Page from 'ui-component/Page';
import useOpenNavDrawer from 'hooks/useOpenNavDrawer';
import AssignmentsCompleteModal from 'components/assignment/AssignmentsCompleteModal';

const extractKnowledgeState = (masteredLearningStandards: any[]): number[] => {
  return masteredLearningStandards.map((mls) => mls.learning_standard_id);
};

const Practice = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useOpenNavDrawer();
  const [codingProblem, setCodingProblem] = useState<any>(null);
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
      'engine.getProblemsByDistance',
      JSON.stringify({
        learningStandards: knowledgeState,
        userId: user.id
      })
    ],
    {
      onSuccess: (data) => {
        if (data) {
          if (data.length > 0) {
            setCodingProblem(data[0]);
          } else {
            setIsAllProblemsComplete(true);
          }
          setIsLoading(false);
        }
      }
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
        if (isCorrect) {
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
        tests
      } = problem;
      return (
        <ProgrammingActivityLayout
          assignmentTitle={assignmentTitle}
          assignmentDescription={assignmentDescription}
          language={language}
          startingCode={startingCode}
          solutionCode={solutionCode}
          tests={tests as ExerciseTests}
          youtubeTutorialUrl={youtubeTutorialUrl}
          goToNextProblem={(isCorrect: boolean) => goToNextProblem(isCorrect)(learningStandards)}
          isLoading={isLoading}
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

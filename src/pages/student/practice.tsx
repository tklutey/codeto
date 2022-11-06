import React, { ReactElement, useState } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';
import { ExerciseTests } from 'server/routers/codingProblem';
import useAuth from 'hooks/useAuth';
import Page from 'ui-component/Page';
import useOpenNavDrawer from 'hooks/useOpenNavDrawer';

const extractKnowledgeState = (masteredLearningStandards: any[]): number[] => {
  return masteredLearningStandards.map((mls) => mls.learning_standard_id);
};

const Practice = () => {
  const { user } = useAuth();
  useOpenNavDrawer();
  const [codingProblem, setCodingProblem] = useState<any>(null);
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
      'codingProblem.getProblemsByDistance',
      JSON.stringify({
        learningStandards: knowledgeState,
        userId: user.id
      })
    ],
    {
      onSuccess: (data) => {
        if (data) {
          setCodingProblem(data[0]);
        }
      }
    }
  );

  const updateKnowledgeStateMutation = trpc.useMutation('knowledgeState.update');
  const updateProblemAttemptHistory = trpc.useMutation('codingProblem.updateProblemAttemptHistory');

  const goToNextProblem = (isCorrect: boolean) => {
    return (learningStandards: number[]) => {
      return async () => {
        await updateProblemAttemptHistory.mutateAsync({
          userId: user.id as string,
          problemId: codingProblem?.id,
          isCorrect
        });
        if (isCorrect) {
          await updateKnowledgeStateMutation.mutateAsync({
            learningStandards,
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
    if (problem) {
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

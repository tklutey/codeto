import React, { ReactElement, useEffect, useState } from 'react';
import Layout from 'layout';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import { trpc } from 'utils/trpc';
import { ExerciseTests } from 'server/routers/codingProblem';
import { openDrawer } from 'store/slices/menu';
import { dispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';
import Page from 'ui-component/Page';

const extractKnowledgeState = (masteredLearningStandards: any[]): number[] => {
  return masteredLearningStandards.map((mls) => mls.learning_standard_id);
};

const Practice = () => {
  const { user } = useAuth();
  if (!user || !user.id) {
    throw new Error('User not found');
  }
  const { drawerOpen } = useSelector((state) => state.menu);
  const [knowledgeState, setKnowledgeState] = useState<number[]>([]);
  const { refetch: refetchMasteredLearningStandards } = trpc.useQuery(['knowledgeState.getMasteredLearningStandards', user.id], {
    onSuccess: (data) => {
      if (data) {
        setKnowledgeState(extractKnowledgeState(data));
      }
    }
  });
  const { data: problemsByDistance } = trpc.useQuery(['codingProblem.getProblemsByDistance', knowledgeState]);
  const codingProblem = problemsByDistance?.[0];

  const updateKnowledgeStateMutation = trpc.useMutation('knowledgeState.update');
  useEffect(() => {
    if (drawerOpen) {
      dispatch(openDrawer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToNextProblem = (isCorrect: boolean) => {
    return (learningStandards: number[]) => {
      return async () => {
        const input = {
          learningStandards,
          userId: user.id
        };
        // @ts-ignore
        await updateKnowledgeStateMutation.mutateAsync(input);
        const { data: updatedMasteredLearningStandards } = await refetchMasteredLearningStandards();
        setKnowledgeState(extractKnowledgeState(updatedMasteredLearningStandards || []));
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

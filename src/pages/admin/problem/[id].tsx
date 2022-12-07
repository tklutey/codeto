import { dispatch, useSelector } from 'store';
import React, { ReactElement, useEffect } from 'react';
import { openDrawer } from 'store/slices/menu';
import { trpc } from 'utils/trpc';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import Layout from 'layout';
import { useRouter } from 'next/router';
import Page from 'ui-component/Page';
import { CodingProblemTest } from 'server/routers/codingProblem';

const Problem = () => {
  const router = useRouter();
  const { id } = router.query;
  const { drawerOpen } = useSelector((state) => state.menu);
  useEffect(() => {
    if (drawerOpen) {
      dispatch(openDrawer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: lesson, isLoading } = trpc.useQuery(['codingProblem.getById', Number(id)]);
  const getPageContent = (problem: any) => {
    if (problem) {
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
        <ProgrammingActivityLayout
          assignmentTitle={assignmentTitle}
          assignmentDescription={assignmentDescription}
          language={language}
          startingCode={startingCode}
          solutionCode={solutionCode}
          tests={codingProblemTests as CodingProblemTest[]}
          youtubeTutorialUrl={youtubeTutorialUrl}
          goToNextProblem={(isCorrect: boolean) => () => {}}
          isLoading={isLoading}
        />
      );
    }
    return <div>Loading...</div>;
  };

  return <Page title="Practice">{getPageContent(lesson)}</Page>;
};

Problem.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Problem;

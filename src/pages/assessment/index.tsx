import { dispatch, useSelector } from 'store';
import React, { ReactElement, useEffect } from 'react';
import { openDrawer } from 'store/slices/menu';
import { trpc } from 'utils/trpc';
import ProgrammingActivityLayout from 'layout/ProgrammingActivityLayout';
import Layout from 'layout';
import Page from 'ui-component/Page';
import { CodingProblemTest } from 'server/routers/codingProblem';
import AssessmentFooter from '../../components/assessment/AssessmentFooter';
import useModal from '../../hooks/useModal';
import AssessmentIntroModal from '../../components/assessment/AssessmentIntroModal';

const Problem = () => {
  const { drawerOpen } = useSelector((state) => state.menu);
  const { isOpen, closeModal } = useModal(true);
  useEffect(() => {
    if (drawerOpen) {
      dispatch(openDrawer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: lesson, isLoading } = trpc.useQuery(['codingProblem.getById', 16]);
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
          />
        </>
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

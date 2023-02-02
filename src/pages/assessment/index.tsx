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
import useAuth from '../../hooks/useAuth';

const Problem = () => {
  const { user } = useAuth();
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

  const { data: problems, isLoading } = trpc.useQuery([
    'engine.getProblemsByDistance',
    JSON.stringify({
      userId: user.id,
      courseId: 2,
      order: 'desc'
    })
  ]);
  const getPageContent = (problemList?: any[]) => {
    if (problemList && problemList.length > 0) {
      const {
        title: assignmentTitle,
        description: assignmentDescription,
        language: language,
        starting_code: startingCode,
        youtube_tutorial_url: youtubeTutorialUrl,
        solution_code: solutionCode,
        coding_problem_tests: codingProblemTests
      } = problemList[0];
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

  return <Page title="Practice">{getPageContent(problems)}</Page>;
};

Problem.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Problem;

import React, { ReactElement } from 'react';
import Layout from '../../../layout';
import Page from 'ui-component/Page';
import Question from '../../../components/multiple-choice/Question';

const MCProblemPage = () => {
  return (
    <Page title="MCProblem">
      <Question prompt={'This is the question'} answerOptions={['Option1', 'Option2', 'Option3', 'Option4']} />
    </Page>
  );
};
MCProblemPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MCProblemPage;

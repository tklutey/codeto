import React, { ReactElement } from 'react';
import Layout from '../../../layout';
import Page from 'ui-component/Page';
import Test from '../../../components/multiple-choice/Test';

const MCProblemPage = () => {
  return (
    <Page title="MCProblem">
      <Test />
    </Page>
  );
};
MCProblemPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MCProblemPage;

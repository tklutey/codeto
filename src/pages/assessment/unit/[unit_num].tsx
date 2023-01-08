import React, { ReactElement } from 'react';
import Layout from '../../../layout';
import Page from 'ui-component/Page';
import Test from '../../../components/multiple-choice/Test';
import { useRouter } from 'next/router';

const UnitAssessmentPage = () => {
  const router = useRouter();
  const { unit_num } = router.query;
  return (
    <Page title={`Assessment: Unit ${unit_num}`}>
      <Test />
    </Page>
  );
};
UnitAssessmentPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default UnitAssessmentPage;

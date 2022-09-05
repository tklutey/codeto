import React, { ReactElement } from 'react';
import Layout from 'layout';
import IDE from 'components/ide';

const Practice = () => {
  return <IDE />;
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

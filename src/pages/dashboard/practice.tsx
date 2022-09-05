import React, { ReactElement } from 'react';
import Layout from 'layout';
import ProgrammingEnvironment from 'widgets/ProgrammingEnvironment';

const Practice = () => {
  return <ProgrammingEnvironment />;
};
Practice.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Practice;

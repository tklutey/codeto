import React, { ReactElement } from 'react';
import Layout from 'layout';
import Page from 'ui-component/Page';
import useLearningStandards from 'hooks/useLearningStandards';
import { trpc } from 'utils/trpc';
import StandardMutateForm from '../../../sections/StandardMutateForm';

const NewStandardPage = () => {
  const { standards: allStandards } = useLearningStandards();

  const createStandard = trpc.useMutation('learningStandards.upsert');
  const { data: parentStandards } = trpc.useQuery(['learningStandards.getCourseStandardsByType', 'objective']);

  return (
    <Page title={'New Standard'}>
      {parentStandards && (
        <StandardMutateForm allStandards={allStandards} allObjectives={parentStandards} createStandardOperation={createStandard} />
      )}
    </Page>
  );
};

NewStandardPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewStandardPage;

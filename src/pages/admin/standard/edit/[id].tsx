import React, { ReactElement } from 'react';
import Layout from '../../../../layout';
import useLearningStandards from '../../../../hooks/useLearningStandards';
import { trpc } from '../../../../utils/trpc';
import Page from 'ui-component/Page';
import StandardMutateForm from '../../../../sections/StandardMutateForm';
import { useRouter } from 'next/router';

const EditStandardPage = () => {
  const router = useRouter();
  const { standards: allStandards } = useLearningStandards();
  const standardId = router.query.id;

  const { data: existingStandard } = trpc.useQuery(['learningStandards.getById', parseInt(standardId as string)]);

  const createStandard = trpc.useMutation('learningStandards.create');
  const { data: parentStandards } = trpc.useQuery(['learningStandards.getCourseStandardsByType', 'objective']);

  return (
    <Page title={'Edit Standard'}>
      {parentStandards && existingStandard && (
        <StandardMutateForm
          initialStandards={allStandards}
          parentStandards={parentStandards}
          createStandard={createStandard}
          code={existingStandard[0].code}
          description={existingStandard[0].description}
        />
      )}
    </Page>
  );
};

EditStandardPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditStandardPage;

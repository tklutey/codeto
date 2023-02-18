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

  const existingDependentStandards = existingStandard ? existingStandard[0]?.dependentStandards : [];
  const existingDependentObjectives = existingStandard ? existingStandard[0]?.parentStandards : [];

  const standardsWithMatches = allStandards.map((standard) => {
    const existing = existingDependentStandards.find((std: number) => std === standard.standard_id);
    return {
      ...standard,
      selected: existing !== undefined && existing !== null
    };
  });
  const objectivesWithMatches = parentStandards?.map((standard) => {
    const existing = existingDependentObjectives.find((std: number) => std === standard.id);
    return {
      ...standard,
      selected: existing !== undefined && existing !== null
    };
  });

  return (
    <Page title={'Edit Standard'}>
      {parentStandards && existingStandard && (
        <StandardMutateForm
          allStandards={standardsWithMatches}
          allObjectives={objectivesWithMatches || []}
          createStandardOperation={createStandard}
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

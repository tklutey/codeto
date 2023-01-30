import { useState } from 'react';
import { trpc } from 'utils/trpc';

const useLearningStandards = () => {
  const [standards, setStandards] = useState<any[]>([]);

  const transformStandards = (data: any) => {
    if (data && data.length > 0) {
      const unitOneStandards = data[0].standards;
      const sortedUnitOneStandards = unitOneStandards
        ? unitOneStandards
            .map((standard: any) => {
              const standardCodeString = standard.standard_code;
              const standardCodeNumeric = parseInt(standardCodeString.charAt(standardCodeString.length - 1));
              return { ...standard, standardCodeNumeric };
            })
            .sort((a: any, b: any) => a.standardCodeNumeric - b.standardCodeNumeric)
        : null;
      if (sortedUnitOneStandards) {
        setStandards(sortedUnitOneStandards);
      }
    }
  };

  trpc.useQuery(['learningStandards.getCourseStandards'], { onSuccess: transformStandards, refetchOnWindowFocus: false });

  return { standards, setStandards };
};

export default useLearningStandards;

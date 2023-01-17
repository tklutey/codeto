import SbClient from 'server/client/SbClient';

export const getCourseStandards = async () => {
  const sbClient = new SbClient();
  const rawLearningStandards = await sbClient.getLearningStandards();
  const units = rawLearningStandards
    ?.map((ls: any) => {
      return {
        unit_id: ls.unit_id,
        unit_name: ls.unit_name,
        unit_sequence: ls.unit_sequence
      };
    })
    .filter((unit: any, index: number, self: any) => self.findIndex((u: any) => u.unit_id === unit.unit_id) === index);
  return units?.map((unit: any) => {
    const unitLearningStandards = rawLearningStandards?.filter((ls: any) => ls.unit_id === unit.unit_id);
    const displayStandards = unitLearningStandards;
    const displayUnit = {
      id: unit.id,
      unit_name: unit.unit_name,
      unit_sequence: unit.unit_sequence,
      standards: displayStandards
    };
    return displayUnit;
  });
};

export const transformCodingProblem = (codingProblem: any) => {
  const { problem_standard_relationship, ...rest } = codingProblem;
  const learningStandards = problem_standard_relationship?.flatMap((psr: any) => {
    if (psr.learning_standard) {
      const ls = psr.learning_standard;
      return {
        standard_id: ls.id,
        standard_code: ls.code,
        standard_description: ls.description
      };
    }
  });
  return {
    ...rest,
    learning_standards: learningStandards
  };
};

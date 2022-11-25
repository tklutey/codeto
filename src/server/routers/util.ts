import SbClient from 'server/client/SbClient';

export const getCourseStandards = async () => {
  const sbClient = new SbClient();
  const rawLearningStandards = await sbClient.getLearningStandards();
  const units = rawLearningStandards
    .map((ls: any) => ls.unit)
    .filter((unit: any, index: number, self: any) => self.findIndex((u: any) => u.id === unit.id) === index);
  return units.map((unit: any) => {
    const unitLearningStandards = rawLearningStandards.filter((ls: any) => ls.unit.id === unit.id);
    const displayStandards = unitLearningStandards.map((ls: any) => {
      return {
        unit_id: ls.unit.id,
        topic_id: ls.topic.id,
        topic_code: ls.topic.code,
        topic_description: ls.topic.description,
        objective_id: ls.objective.id,
        objective_code: ls.objective.code,
        objective_description: ls.objective.description,
        standard_id: ls.standard.id,
        standard_code: ls.standard.code,
        standard_description: ls.standard.description
      };
    });
    const displayUnit = { id: unit.id, unit_name: unit.unit_name, standards: displayStandards };
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

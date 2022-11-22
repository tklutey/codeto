export const transformCodingProblem = (codingProblem: any) => {
  const { basis_knowledge_state, ...rest } = codingProblem;
  // @ts-ignore
  const learningStandards = basis_knowledge_state?.flatMap((bks) => {
    // @ts-ignore
    const a = bks.standard_basis_relationship.map((sbr) => sbr.standard_id);
    return a;
  });
  return {
    ...rest,
    learning_standards: learningStandards
  };
};

export const transformCodingProblem = (codingProblem: any) => {
  const { basis_knowledge_state, ...rest } = codingProblem;
  console.log(basis_knowledge_state);
  // @ts-ignore
  const learningStandards = basis_knowledge_state?.flatMap((bks) => {
    // @ts-ignore
    const a = bks.standard_basis_relationship.map((sbr) => {
      if (sbr.learning_standard) {
        return {
          standard_id: sbr.standard_id,
          standard_code: sbr.learning_standard.code,
          standard_description: sbr.learning_standard.description
        };
      }
      return sbr.standard_id;
    });
    return a;
  });
  return {
    ...rest,
    learning_standards: learningStandards
  };
};

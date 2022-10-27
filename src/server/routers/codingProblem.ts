import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';

export type TestInstance = {
  summary: string;
  matchRegex: string;
};
export type ExerciseTests = {
  expectedOutput: TestInstance[];
  expectedSourceCode: TestInstance[];
};

const transformCodingProblem = (codingProblem: any) => {
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
export const codingProblem = trpc
  .router()
  .query('getById', {
    input: z.number(),
    async resolve({ input }) {
      const id = input;
      const sbClient = new SbClient();
      const codingProblemQueryResult = await sbClient.getCodingProblemById(id);
      const transformedResult = codingProblemQueryResult?.map((cp) => {
        return transformCodingProblem(cp);
      })[0];
      // @ts-ignore
      return transformedResult;
    }
  })
  .query('getProblemsByDistance', {
    input: z.array(z.number()),
    async resolve({ input }) {
      const arr = input;
      const sbClient = new SbClient();
      const allCodingProblems = await sbClient.getAllCodingProblems();
      const transformedCodingProblems = allCodingProblems?.map((cp) => transformCodingProblem(cp));
      const learningStandards = transformedCodingProblems
        ?.map((cp) => {
          const { learning_standards, ...rest } = cp;
          const intersection = arr.filter((x) => learning_standards?.includes(x));
          const distance = learning_standards.length - intersection.length;
          return {
            ...rest,
            learning_standards,
            distance
          };
        })
        .sort((a, b) => a.distance - b.distance);
      return learningStandards;
    }
  });

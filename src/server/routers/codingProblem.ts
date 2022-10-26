import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';
import { definitions } from 'types/supabase';

export type TestInstance = {
  summary: string;
  matchRegex: string;
};
export type ExerciseTests = {
  expectedOutput: TestInstance[];
  expectedSourceCode: TestInstance[];
};
export const codingProblem = trpc
  .router()
  .query('getById', {
    input: z.number(),
    async resolve({ input }): Promise<definitions['coding_problem']> {
      const id = input;
      const sbClient = new SbClient();
      const codingProblemQueryResult = await sbClient.getCodingProblemById(id);
      const transformedResult = codingProblemQueryResult?.map((cp) => {
        const { basis_knowledge_state, ...rest } = cp;
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
      });
      // @ts-ignore
      return transformedResult;
    }
  })
  .query('getProblemsWithStandards', {
    input: z.array(z.number()),
    async resolve({ input }) {
      const arr = input;
      const sbClient = new SbClient();
      const codingProblemsWithStandards = await sbClient.getCodingProblemsWithStandards();
      const a = codingProblemsWithStandards?.map((problem) => {
        const isMastered = arr.includes(problem.learning_standard_id);
        return { ...problem, isMastered };
      });
      const b = a?.reduce((acc, curr) => {
        const { isMastered, coding_problem_id: codingProblemId } = curr;
        const value = isMastered ? 0 : 1;
        if (!acc[codingProblemId]) {
          acc[codingProblemId] = 0;
        }
        acc[codingProblemId] += value;
        return acc;
      }, {});
      const c = a?.map((problem) => {
        const distanceFromCurrentKnowledgeState = b[problem.coding_problem_id];
        return { ...problem, distanceFromCurrentKnowledgeState };
      });
      return c;
    }
  });

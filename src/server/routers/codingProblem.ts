import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';
import { transformCodingProblem } from 'server/routers/util';

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
  .mutation('updateProblemAttemptHistory', {
    input: z.object({
      problemId: z.number(),
      userId: z.string(),
      isCorrect: z.boolean()
    }),
    async resolve({ input }) {
      const { problemId, userId, isCorrect } = input;
      const sbClient = new SbClient();
      const result = await sbClient.updateCodingProblemAttemptHistory(problemId, userId, isCorrect);
      return result;
    }
  });

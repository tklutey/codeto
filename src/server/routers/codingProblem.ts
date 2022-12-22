import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';
import { transformCodingProblem } from 'server/routers/util';

export type CodingProblemTest = {
  test_type: 'regex' | 'code';
  source_type: 'stdin' | 'stdout';
  test_message: string;
  test_code: string;
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
  .mutation('create', {
    input: z.object({
      title: z.string(),
      description: z.string(),
      startingCode: z.string(),
      solutionCode: z.string(),
      expectedOutputTests: z.array(
        z.object({
          message: z.string(),
          testCode: z.string(),
          type: z.string()
        })
      ),
      sourceCodeTests: z.array(
        z.object({
          message: z.string(),
          testCode: z.string(),
          type: z.string()
        })
      ),
      source: z.string(),
      youtubeUrl: z.string(),
      dependentStandards: z.array(z.number())
    }),
    async resolve({ input }) {
      const {
        title,
        description,
        startingCode,
        solutionCode,
        expectedOutputTests,
        sourceCodeTests,
        source,
        youtubeUrl,
        dependentStandards
      } = input;
      const tests = { expectedOutput: expectedOutputTests, expectedSourceCode: sourceCodeTests };
      const problem = {
        title,
        description,
        language: 'java',
        starting_code: startingCode,
        solution_code: solutionCode,
        tests,
        youtube_tutorial_url: youtubeUrl,
        source
      };
      const sbClient = new SbClient();
      const result = await sbClient.createCodingProblem(problem, dependentStandards);
      return result;
    }
  })
  .mutation('updateProblemAttemptHistory', {
    input: z.object({
      problemId: z.number(),
      userId: z.string(),
      problemAttemptStatus: z.string()
    }),
    async resolve({ input }) {
      const { problemId, userId, problemAttemptStatus } = input;
      const sbClient = new SbClient();
      const result = await sbClient.updateCodingProblemAttemptHistory(problemId, userId, problemAttemptStatus);
      return result;
    }
  });

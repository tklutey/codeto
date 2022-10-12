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
export const codingProblem = trpc.router().query('get', {
  input: z.number(),
  async resolve({ input }): Promise<definitions['coding_problem']> {
    const id = input;
    const sbClient = new SbClient();
    const codingProblemQueryResult = await sbClient.getCodingProblemById(id);
    // @ts-ignore
    return codingProblemQueryResult;
  }
});

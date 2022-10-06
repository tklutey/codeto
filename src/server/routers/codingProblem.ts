import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';

export type TestInstance = {
  summary: string;
  matchRegex: string;
};
export type ExerciseTests = {
  expectedOutput: TestInstance[];
  expectedSourceCode: TestInstance[];
};
export const codingProblem = trpc.router().query('get', {
  async resolve() {
    const sbClient = new SbClient();
    const codingProblemQueryResult = await sbClient.getCodingProblem();
    if (codingProblemQueryResult && codingProblemQueryResult?.length > 0) {
      return codingProblemQueryResult[0];
    }
    return null;
  }
});

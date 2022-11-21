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

const sortProblems = (a: any, b: any) => {
  const hasSuccessfulAttempt = (problem: any) => {
    return problem.user_problem_attempt_history.some((attempt: any) => attempt.is_successful_attempt);
  };
  const getMostRecentAttemptTimestamp = (problem: any) => {
    const timestamps = problem.user_problem_attempt_history.map((attempt: any) => new Date(attempt.attempt_timestamp));
    if (timestamps.length === 0) {
      return 0;
    }
    return Math.max(...timestamps);
  };

  // sort by fringe distance
  if (a.distance > 0 && b.distance > 0) {
    if (a.distance < b.distance) return -1;
    if (a.distance > b.distance) return 1;
  }

  // Next, sort by whether there is a successful attempt
  if (!hasSuccessfulAttempt(a) && hasSuccessfulAttempt(b)) return -1;
  if (hasSuccessfulAttempt(a) && !hasSuccessfulAttempt(b)) return 1;

  // Next, sort by most recent attempt
  if (getMostRecentAttemptTimestamp(a) < getMostRecentAttemptTimestamp(b)) return -1;
  if (getMostRecentAttemptTimestamp(a) > getMostRecentAttemptTimestamp(b)) return 1;

  return 0;
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
    input: z.string(),
    async resolve({ input }) {
      const { userId, learningStandards } = JSON.parse(input);
      const sbClient = new SbClient();
      const allCodingProblems = await sbClient.getAllCodingProblems(userId);
      const transformedCodingProblems = allCodingProblems?.map((cp) => transformCodingProblem(cp));
      const sortedLearningStandards = transformedCodingProblems
        ?.map((cp) => {
          const { learning_standards, ...rest } = cp;
          const intersection = learningStandards.filter((x: any) => learning_standards?.includes(x));
          const distance = learning_standards.length - intersection.length;
          return {
            ...rest,
            learning_standards,
            distance
          };
        })
        .sort(sortProblems);
      return sortedLearningStandards;
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

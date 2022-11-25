import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';
import { getCurrentUserStreak } from 'server/routers/userHistory';
import { transformCodingProblem } from './util';

const streakToTargetDistance = (streak: number) => {
  return 2 ** streak;
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
  if (a.distanceFromTarget < b.distanceFromTarget) return -1;
  if (a.distanceFromTarget > b.distanceFromTarget) return 1;

  // Next, sort by whether there is a successful attempt
  if (!hasSuccessfulAttempt(a) && hasSuccessfulAttempt(b)) return -1;
  if (hasSuccessfulAttempt(a) && !hasSuccessfulAttempt(b)) return 1;

  // Next, sort by most recent attempt
  if (getMostRecentAttemptTimestamp(a) < getMostRecentAttemptTimestamp(b)) return -1;
  if (getMostRecentAttemptTimestamp(a) > getMostRecentAttemptTimestamp(b)) return 1;

  // sort by number of standards mapped to problem, i.e. the more standards, the more difficult
  if (a.learning_standards.length < b.learning_standards.length) return -1;
  if (a.learning_standards.length > b.learning_standards.length) return 1;

  return 0;
};
export const engine = trpc.router().query('getProblemsByDistance', {
  input: z.string(),
  async resolve({ input }) {
    const { userId, learningStandards: userLearningStandards } = JSON.parse(input);
    const sbClient = new SbClient();
    const currentStreak = await getCurrentUserStreak(userId);
    const targetDistance = streakToTargetDistance(currentStreak);
    const allCodingProblems = await sbClient.getAllCodingProblems(userId);
    const transformedCodingProblems = allCodingProblems?.map((cp) => transformCodingProblem(cp));
    const sortedLearningStandards = transformedCodingProblems
      ?.map((cp) => {
        const { learning_standards, ...rest } = cp;
        const numericLearningStandards = learning_standards.map((ls: any) => ls.standard_id);
        const intersection = userLearningStandards.filter((x: any) => numericLearningStandards?.includes(x));
        const distance = learning_standards.length - intersection.length;
        const distanceFromTarget = Math.abs(targetDistance - distance);
        return {
          ...rest,
          learning_standards,
          distance,
          distanceFromTarget
        };
      })
      .sort(sortProblems)
      .filter((cp) => cp.distance > 0);
    return sortedLearningStandards;
  }
});

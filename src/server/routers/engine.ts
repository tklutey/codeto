import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';
import { getCurrentUserStreak } from 'server/routers/userHistory';
import { transformCodingProblem } from './util';

const streakToTargetDistance = (streak: number) => {
  return 2 ** streak;
};

const calculateStreak = (sortedCodingProblems: any) => {
  const attemptHistory = sortedCodingProblems?.flatMap((cp: any) => cp.user_problem_attempt_history);
  const sortedAttemptHistory = attemptHistory?.sort((a: any, b: any) => {
    const aTimestamp = new Date(a.attempt_timestamp);
    const bTimestamp = new Date(b.attempt_timestamp);
    return aTimestamp.getTime() - bTimestamp.getTime();
  });
  let streak = 0;
  // get number of problems in a row that are correct
  for (let i = 0; i < sortedAttemptHistory.length; i++) {
    const attempt = sortedAttemptHistory[i];
    if (attempt.is_successful_attempt) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
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

  // sort by the number of characters in the solution code, i.e. the more characters, the more difficult
  if (a.solution_code.length < b.solution_code.length) return -1;
  if (a.solution_code.length > b.solution_code.length) return 1;

  return 0;
};

const getProblemsByDistance = async (userId: string, userLearningStandards: number[]) => {
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
};
export const engine = trpc
  .router()
  .query('getProblemsByDistance', {
    input: z.string(),
    async resolve({ input }) {
      const { userId, learningStandards: userLearningStandards } = JSON.parse(input);
      return getProblemsByDistance(userId, userLearningStandards);
    }
  })
  .query('getProblemSetsByDistance', {
    input: z.string(),
    async resolve({ input }) {
      const { userId, learningStandards: userLearningStandards } = JSON.parse(input);
      const problemsByDistance = await getProblemsByDistance(userId, userLearningStandards);
      // group problems that share the same exact learning standards
      const problemSetsByDistance = problemsByDistance?.reduce((acc: any, problem: any) => {
        const { learning_standards, distance, distanceFromTarget, ...rest } = problem;
        const learningStandardsString = JSON.stringify(learning_standards);
        const cp = {
          ...rest,
          learning_standards
        };
        if (acc[learningStandardsString]) {
          acc[learningStandardsString].coding_problems = [...acc[learningStandardsString].coding_problems, cp];
          if (
            distance !== acc[learningStandardsString].distance ||
            distanceFromTarget !== acc[learningStandardsString].distanceFromTarget
          ) {
            throw new Error('distance should be the same for all problems in a problem set');
          }
        } else {
          acc[learningStandardsString] = {
            coding_problems: [cp],
            distance,
            distanceFromTarget,
            learning_standards
          };
        }
        return acc;
      }, {});

      const sortedProblemSetsByDistance = Object.entries(problemSetsByDistance).map(([key, value]: [string, any]) => {
        const { coding_problems, ...rest } = value;
        const sortedCodingProblems = coding_problems.sort(sortProblems);
        return {
          id: key,
          ...rest,
          coding_problems: sortedCodingProblems,
          streak: calculateStreak(sortedCodingProblems)
        };
      });
      return sortedProblemSetsByDistance;
    }
  });

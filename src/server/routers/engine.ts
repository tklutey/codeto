import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';
import { getCurrentUserStreak } from 'server/routers/userHistory';
import { transformCodingProblem } from './util';
import { getMasteryStatusByKey, MasteryStatus } from 'server/types';
import { problemSetOutputValidator } from 'server/pipeline/validators/problemSet';

const streakToTargetDistance = (streak: number) => {
  return 2 ** streak;
};

const calculateStreak = (sortedCodingProblems: any) => {
  const attemptHistory = sortedCodingProblems?.flatMap((cp: any) => cp.user_problem_attempt_history);
  const sortedAttemptHistory = attemptHistory?.sort((a: any, b: any) => {
    const aTimestamp = new Date(a.attempt_timestamp);
    const bTimestamp = new Date(b.attempt_timestamp);
    return bTimestamp.getTime() - aTimestamp.getTime();
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

const sortProblemSets = (a: any, b: any) => {
  const isCurrentlyLearning = (problemSet: any) => {
    const masteryStatus = getMasteryStatusByKey(problemSet.mastery_status);
    const problemAttempts = problemSet.coding_problems.flatMap((cp: any) => cp.user_problem_attempt_history);
    return problemAttempts.length > 0 && masteryStatus !== MasteryStatus.Mastered;
  };
  if (isCurrentlyLearning(a) && !isCurrentlyLearning(b)) return -1;
  if (!isCurrentlyLearning(a) && isCurrentlyLearning(b)) return 1;

  // sort by fringe distance
  if (a.distanceFromTarget < b.distanceFromTarget) return -1;
  if (a.distanceFromTarget > b.distanceFromTarget) return 1;
  return 0;
};

const getProblemsByDistance = async (userId: string, userLearningStandards: number[]) => {
  const sbClient = new SbClient();
  const currentStreak = await getCurrentUserStreak(userId);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const targetDistance = streakToTargetDistance(currentStreak);
  const allCodingProblems = await sbClient.getAllCodingProblems(userId);
  const transformedCodingProblems = allCodingProblems?.map((cp) => transformCodingProblem(cp));
  const sortedLearningStandards = transformedCodingProblems
    ?.map((cp) => {
      const { learning_standards, ...rest } = cp;
      const numericLearningStandards = learning_standards.map((ls: any) => ls.standard_id);
      const intersection = userLearningStandards.filter((x: any) => numericLearningStandards?.includes(x));
      const distance = learning_standards.length - intersection.length;
      // const distanceFromTarget = Math.abs(targetDistance - distance);
      // TODO: turning off adaptive learning for now
      const distanceFromTarget = distance;
      return {
        ...rest,
        learning_standards,
        distance,
        distanceFromTarget
      };
    })
    .sort(sortProblems);
  return sortedLearningStandards;
};

export const getProblemSetsByDistance = async (userId: string) => {
  const sbClient = new SbClient();
  const userLearningStandards = (await sbClient.getMasteredStandardsForUser(userId))?.map((standard: any) => standard.learning_standard_id);
  const problemsByDistance = await getProblemsByDistance(userId, userLearningStandards ? userLearningStandards : []);
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
      if (distance !== acc[learningStandardsString].distance || distanceFromTarget !== acc[learningStandardsString].distanceFromTarget) {
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

  const problemSetsWithSortedProblems = Object.entries(problemSetsByDistance).map(([key, value]: [string, any]) => {
    const { coding_problems, ...rest } = value;
    const sortedCodingProblems = coding_problems.sort(sortProblems);
    // get mastery status by index
    const streak = calculateStreak(sortedCodingProblems);
    const masteryStatus = MasteryStatus[streak];

    return {
      id: key,
      ...rest,
      coding_problems: sortedCodingProblems,
      streak: streak,
      mastery_status: masteryStatus.valueOf()
    };
  });
  return problemSetsWithSortedProblems.sort(sortProblemSets);
};
export const engine = trpc
  .router()
  .query('getProblemsByDistance', {
    input: z.string(),
    async resolve({ input }) {
      const { userId, learningStandards: userLearningStandards } = JSON.parse(input);
      return (await getProblemsByDistance(userId, userLearningStandards))?.filter((cp) => cp.distance > 0);
    }
  })
  .query('getProblemSetsByDistance', {
    input: z.string(),
    async resolve({ input }) {
      const { userId } = JSON.parse(input);
      const problemSets = (await getProblemSetsByDistance(userId))?.filter((ps) => ps.distance > 0);
      const validatedProblemSets = problemSetOutputValidator(problemSets);
      return validatedProblemSets;
    }
  });

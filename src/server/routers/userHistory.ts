import { z } from 'zod';
import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';

const getCurrentUserStreak = async (userId: string) => {
  const sbClient = new SbClient();
  const result = await sbClient.getUserProblemAttemptHistory(userId);
  const sortedAttempts = result?.sort((a: any, b: any) => {
    const toDateObject = (dateString: string) => new Date(dateString);
    if (toDateObject(a.attempt_timestamp) < toDateObject(b.attempt_timestamp)) return 1;
    if (toDateObject(a.attempt_timestamp) > toDateObject(b.attempt_timestamp)) return -1;
    return 0;
  });
  const streakSet = new Set();
  if (sortedAttempts && sortedAttempts?.length > 0) {
    for (let i = 0; i < sortedAttempts.length; i++) {
      if (sortedAttempts[i].is_successful_attempt) {
        streakSet.add(sortedAttempts[i].problem_id);
      } else {
        return streakSet.size;
      }
    }
  }
  return streakSet.size;
};

export const userHistory = trpc.router().query('getCurrentStreak', {
  input: z.string(),
  async resolve({ input }) {
    const userId = input;
    return getCurrentUserStreak(userId);
  }
});

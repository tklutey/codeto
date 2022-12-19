import * as trpc from '@trpc/server';
import { z } from 'zod';
import { getProblemSetsByDistance } from 'server/routers/engine';
import SbClient from 'server/client/SbClient';
import { getMasteryStatusByKey, MasteryStatus } from 'server/types';

export const userProblem = trpc.router().mutation('submitProblemAttempt', {
  input: z.object({
    userId: z.string(),
    codingProblemId: z.number(),
    isCorrect: z.boolean()
  }),
  async resolve({ input }) {
    // Accept: userId, problemId, isSuccessfulAttempt => update userProblemAttemptHistory
    const { userId, codingProblemId, isCorrect } = input;
    const sbClient = new SbClient();
    // update problem attempt history
    await sbClient.updateCodingProblemAttemptHistory(codingProblemId, userId, isCorrect);
    const masteredStandards = (await sbClient.getMasteredStandardsForUser(userId))?.map((standard: any) => standard.learning_standard_id);
    const problemSets = await getProblemSetsByDistance(userId, masteredStandards ? masteredStandards : []);
    // find codingProblemId in problemSets
    const problemSet = problemSets.find((set: any) => set.coding_problems.find((problem: any) => problem.id === codingProblemId));
    if (getMasteryStatusByKey(problemSet.mastery_status) === MasteryStatus.Mastered) {
      // update knowledge state
      const problemSetLearningStandards = problemSet.learning_standards.map((standard: any) => standard.id);
      await sbClient.updateUserKnowledgeState(problemSetLearningStandards, userId);
    }
    return problemSet;
  }
});

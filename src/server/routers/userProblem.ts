import * as trpc from '@trpc/server';
import { z } from 'zod';
import { getProblemSetsByDistance } from 'server/routers/engine';
import SbClient from 'server/client/SbClient';
import { convertMasteryStatusToString, getMasteryStatusByKey, MasteryStatus } from 'server/types';

const getMasteryStatusFromAttemptStatus = (attemptStatus: string) => {
  switch (attemptStatus) {
    case 'correct':
      return MasteryStatus.Mastered;
    case 'incorrect':
      return MasteryStatus.Failed;
    case 'skipped':
      return MasteryStatus.Failed;
    default:
      return MasteryStatus.Unattempted;
  }
};
export const userProblem = trpc
  .router()
  .mutation('submitProblemAttempt', {
    input: z.object({
      userId: z.string(),
      codingProblemId: z.number(),
      problemAttemptStatus: z.string()
    }),
    async resolve({ input }) {
      // Accept: userId, problemId, isSuccessfulAttempt => update userProblemAttemptHistory
      const { userId, codingProblemId, problemAttemptStatus } = input;
      const sbClient = new SbClient();
      // update problem attempt history
      await sbClient.updateCodingProblemAttemptHistory(codingProblemId, userId, problemAttemptStatus);
      const problemSets = await getProblemSetsByDistance(userId);
      // find codingProblemId in problemSets
      const problemSet = problemSets.find((set: any) => set.coding_problems.find((problem: any) => problem.id === codingProblemId));
      if (getMasteryStatusByKey(problemSet.mastery_status) === MasteryStatus.Mastered) {
        // update knowledge state
        const problemSetLearningStandards = problemSet.learning_standards.map((standard: any) => standard.standard_id);
        await sbClient.updateUserKnowledgeState(problemSetLearningStandards, userId);
      }
      return problemSet;
    }
  })
  .mutation('submitAssessmentProblemAttempt', {
    input: z.object({
      userId: z.string(),
      codingProblemId: z.number(),
      problemAttemptStatus: z.string()
    }),
    async resolve({ input }) {
      const { userId, codingProblemId, problemAttemptStatus } = input;
      const sbClient = new SbClient();
      // update problem attempt history
      await sbClient.updateCodingProblemAttemptHistory(codingProblemId, userId, problemAttemptStatus);
      const masteryStatus = convertMasteryStatusToString(getMasteryStatusFromAttemptStatus(problemAttemptStatus));
      const codingProblem = await sbClient.getCodingProblemById(codingProblemId);
      const standardMasteryStatuses: Record<string, any>[] | undefined = codingProblem?.flatMap((problem: any) =>
        problem.learning_standard.map((standard: any) => {
          return {
            standard_id: standard.id,
            mastery_status: masteryStatus
          };
        })
      );
      if (standardMasteryStatuses) {
        return sbClient.updateUserKnowledgeStateV2(standardMasteryStatuses, userId);
      }
      return null;
    }
  });

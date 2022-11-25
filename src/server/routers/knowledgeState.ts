import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';
import { getCourseStandards } from 'server/routers/util';

export const knowledgeState = trpc
  .router()
  .mutation('update', {
    input: z.object({
      learningStandards: z.array(z.number()),
      userId: z.string()
    }),
    async resolve({ input }) {
      const { learningStandards, userId } = input;
      const sbClient = new SbClient();
      return sbClient.updateUserKnowledgeState(learningStandards, userId);
    }
  })
  .query('getMasteredLearningStandards', {
    input: z.string(),
    async resolve({ input }) {
      const userId = input;
      const sbClient = new SbClient();
      return sbClient.getMasteredStandardsForUser(userId);
    }
  })
  .mutation('resetUserMastery', {
    input: z.object({
      userId: z.string()
    }),
    async resolve({ input }) {
      const { userId } = input;
      const sbClient = new SbClient();
      await sbClient.deleteUserProblemAttemptHistory(userId);
      return sbClient.deleteUserMasteredStandards(userId);
    }
  })
  .query('getUserCourseMasterySummary', {
    input: z.string(),
    async resolve({ input }) {
      const userId = input;
      const sbClient = new SbClient();
      const courseSummaryPromise = getCourseStandards();
      const masteredStandards = await sbClient.getMasteredStandardsForUser(userId);
      const masteredStandardIds = new Set(masteredStandards?.map((standard) => standard.learning_standard_id));
      const courseSummary = await courseSummaryPromise;
      const courseSummaryWithMastery = courseSummary?.map((unit: any) => {
        const standardsWithMastery = unit.standards?.map((standard: any) => {
          return {
            ...standard,
            mastered: masteredStandardIds.has(standard.standard_id)
          };
        });
        // get percentage of standards in unit that are mastered
        const masteredStandardsCount = standardsWithMastery?.filter((standard: any) => standard.mastered).length;
        if (masteredStandardsCount && standardsWithMastery) {
        }
        const unitMastery =
          masteredStandardsCount && standardsWithMastery ? Math.round((masteredStandardsCount / standardsWithMastery?.length) * 100) : 0;
        return {
          ...unit,
          unit_mastery: unitMastery,
          standards: standardsWithMastery
        };
      });
      return courseSummaryWithMastery;
    }
  });

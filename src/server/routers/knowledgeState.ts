import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';

const getCourseSummary = async () => {
  const sbClient = new SbClient();
  const topicUnitRelationshipsPromise = sbClient.getTopicUnitRelationships();
  const learningStandardRelationships = await sbClient.getLearningStandardRelationships();
  const learningStandards = await sbClient.getAllLearningStandards();
  const unitsPromise = sbClient.getAllCourseUnits();
  const decoratedLearningStandardRelationships = learningStandardRelationships
    ?.map((lsr) => {
      const parent = learningStandards?.find((ls) => ls.id === lsr.parent_id);
      const child = learningStandards?.find((ls) => ls.id === lsr.child_id);
      return {
        parent,
        child
      };
    })
    .filter((lsr) => lsr.parent.type === 'topic');
  const topicUnitRelationships = await topicUnitRelationshipsPromise;
  const learningStandardsWithUnits = decoratedLearningStandardRelationships
    ?.map((lsr) => {
      const unit = topicUnitRelationships?.find((tur) => tur.topic_id === lsr.parent.id);
      if (!unit) {
        console.log('no unit found for topic', lsr.parent.code);
      }
      return {
        ...lsr,
        unitId: unit.unit_id
      };
    })
    .map((lsr) => {
      const { parent: topic, child: objective, unitId } = lsr;
      return {
        unitId: unitId,
        objective_id: objective.id,
        objective_code: objective.code,
        objective_description: objective.description,
        topic_id: topic.id,
        topic_code: topic.code,
        topic_description: topic.description
      };
    });
  const units = await unitsPromise;
  const unitStandardDetails = units?.map((unit) => {
    const unitLearningStandards = learningStandardsWithUnits?.filter((ls) => ls.unitId === unit.id);
    return {
      unit_id: unit.id,
      unit_name: unit.unit_name,
      standards: unitLearningStandards
    };
  });
  return unitStandardDetails;
};

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
  .query('getLearningStandardsForCourse', {
    async resolve() {
      return getCourseSummary();
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
      const courseSummaryPromise = getCourseSummary();
      const masteredStandards = await sbClient.getMasteredStandardsForUser(userId);
      const masteredStandardIds = new Set(masteredStandards?.map((standard) => standard.learning_standard_id));
      const courseSummary = await courseSummaryPromise;
      const courseSummaryWithMastery = courseSummary?.map((unit) => {
        const standardsWithMastery = unit.standards?.map((standard) => {
          return {
            ...standard,
            mastered: masteredStandardIds.has(standard.objective_id)
          };
        });
        // get percentage of standards in unit that are mastered
        const masteredStandardsCount = standardsWithMastery?.filter((standard) => standard.mastered).length;
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

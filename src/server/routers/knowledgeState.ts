import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { definitions } from 'types/supabase';
import { z } from 'zod';

const generateFakeMastery = (learningStandard: definitions['decorated_denormalized_standards']) => {
  if (learningStandard.standard_code) {
    const mastery = Math.random() * 100;
    return {
      ...learningStandard,
      mastery
    };
  }
  return learningStandard;
};

export const knowledgeState = trpc
  .router()
  .query('get', {
    async resolve() {
      const sbClient = new SbClient();
      const learningStandards = await sbClient.getKnowledgeState();
      const masteryMappedStandards = learningStandards?.map(generateFakeMastery);
      // @ts-ignore
      const units = [...new Set(masteryMappedStandards?.map((ls) => ls.unit_id))];
      const a = units.map((unit) => {
        const matchingStandards = masteryMappedStandards?.filter((standard) => standard.unit_id === unit);
        // @ts-ignore
        const unitMastery = matchingStandards?.reduce((acc, standard) => acc + standard.mastery, 0) / matchingStandards?.length;
        return {
          unit_id: unit,
          unit_name: matchingStandards?.[0].unit_name,
          unit_mastery: unitMastery ? Math.round(unitMastery) : 0,
          standards: matchingStandards
        };
      });
      return a;
    }
  })
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
      const sbClient = new SbClient();
      const topicUnitRelationshipsPromise = sbClient.getTopicUnitRelationships();
      const learningStandardRelationships = await sbClient.getLearningStandardRelationships();
      const learningStandards = await sbClient.getAllLearningStandards();
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
            unit
          };
        })
        .map((lsr) => {
          const { parent: topic, child: objective, unit } = lsr;
          return {
            unitId: unit.id,
            topic: {
              id: topic.id,
              code: topic.code,
              description: topic.description
            },
            objective: {
              id: objective.id,
              code: objective.code,
              description: objective.description
            }
          };
        });
      return learningStandardsWithUnits;
    }
  })
  .query('getUserCourseMasterySummary', {
    input: z.string(),
    async resolve({ input }) {
      const userId = input;
      const sbClient = new SbClient();
      const masteredStandards = await sbClient.getMasteredStandardsForUser(userId);
      const masteredStandardIds = new Set(masteredStandards?.map((standard) => standard.learning_standard_id));
      const courseStandards = await sbClient.getLearningStandardRelationships();
      const masterySummary = courseStandards?.map((standard) => {
        const isMastered = masteredStandardIds.has(standard?.learning_standard?.id);
        return {
          ...standard,
          isMastered
        };
      });
      return masterySummary;
    }
  });

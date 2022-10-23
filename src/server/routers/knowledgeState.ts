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
    async resolve() {
      const sbClient = new SbClient();
      return 'a';
    }
  });

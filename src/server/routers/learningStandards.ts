import * as trpc from '@trpc/server';
import { getCourseStandards } from './util';
import { z } from 'zod';
import SbClient from 'server/client/SbClient';

export const learningStandards = trpc
  .router()
  .query('getCourseStandards', {
    async resolve() {
      return getCourseStandards();
    }
  })
  .query('getCourseStandardsByType', {
    input: z.string(),
    async resolve({ input }) {
      const type = input;
      const sbClient = new SbClient();
      return sbClient.getLearningStandardByType(type);
    }
  })
  .mutation('create', {
    input: z.object({
      type: z.string(),
      code: z.string(),
      description: z.string(),
      dependentStandards: z.array(z.number())
    }),
    async resolve({ input }) {
      const { dependentStandards, ...learningStandard } = input;
      const sbClient = new SbClient();
      const result = sbClient.createStandard(learningStandard, dependentStandards);
      return result;
    }
  });

import * as trpc from '@trpc/server';
import { getCourseStandards } from './util';
import { z } from 'zod';
import SbClient from 'server/client/SbClient';

export const learningStandards = trpc
  .router()
  .query('getCourseStandards', {
    async resolve() {
      const standards = await getCourseStandards();
      const sbClient = new SbClient();
      const codingProblems = await sbClient.getCodingProblemsByCourseId(2);
      // filter standards that don't appear in any coding problems
      const filteredStandards = standards?.map((standard) => {
        const filteredStandard = {
          ...standard,
          standards: standard.standards?.filter((s) => {
            return codingProblems?.some((cp) => {
              return cp.problem_standard_relationship?.some((psr: any) => {
                return psr.learning_standard.id === s.standard_id;
              });
            });
          })
        };
        return filteredStandard;
      });
      return filteredStandards;
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
  .mutation('upsert', {
    input: z.object({
      type: z.string(),
      code: z.string(),
      description: z.string(),
      dependentStandards: z.array(z.number()),
      parent: z.number(),
      id: z.number().optional()
    }),
    async resolve({ input }) {
      const { dependentStandards, parent, id, ...learningStandard } = input;
      const sbClient = new SbClient();
      const result = sbClient.upsertStandard(id, learningStandard, parent, dependentStandards);
      return result;
    }
  })
  .mutation('delete', {
    input: z.object({
      id: z.number()
    }),
    async resolve({ input }) {
      const { id } = input;
      const sbClient = new SbClient();
      const result = sbClient.deleteStandard(id);
      return result;
    }
  })

  .query('getById', {
    input: z.number(),
    async resolve({ input }) {
      const id = input;
      const sbClient = new SbClient();
      const standard = await sbClient.getLearningStandardById(id);
      const transformedStandard = standard?.map((std: any) => {
        const { standard_dependencies, standard_relationship, ...rest } = std;
        const dependencies = standard_dependencies?.map((dependency: any) => dependency.dependent_standard);
        const parentStandards = standard_relationship?.map((relationship: any) => relationship.parent_id);
        return { ...rest, dependentStandards: dependencies, parentStandards };
      });
      return transformedStandard;
    }
  });

import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';

export const knowledgeState = trpc.router().query('get', {
  async resolve() {
    const sbClient = new SbClient();
    const learningUnits = await sbClient.get_learning_units();
    let learningUnitMastery: Record<string, number> = {};
    learningUnits?.forEach((learningUnit) => {
      if (learningUnit.unit_name) {
        learningUnitMastery[learningUnit.unit_name] = Math.floor(Math.random() * 100);
      }
    });
    return learningUnitMastery;
  }
});

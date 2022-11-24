import * as trpc from '@trpc/server';
import { getCourseStandards } from './util';

export const learningStandards = trpc.router().query('getCourseStandards', {
  async resolve() {
    return getCourseStandards();
  }
});

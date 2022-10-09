import * as trpc from '@trpc/server';
import SbClient from 'server/client/SbClient';
import { z } from 'zod';

export const fringe = trpc.router().query('get', {
  input: z.array(z.number()),
  async resolve({ input }) {
    const arr = input;
    const sbClient = new SbClient();
    const fringeQueryResult = await sbClient.getFringeStandards(arr);
    return fringeQueryResult;
  }
});

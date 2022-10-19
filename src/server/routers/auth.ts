import * as trpc from '@trpc/server';
import { z } from 'zod';
import SbClient from 'server/client/SbClient';

export const auth = trpc
  .router()
  .mutation('register', {
    input: z.object({
      email: z.string(),
      password: z.string()
    }),
    async resolve({ input }) {
      const { email, password } = input;
      const sbClient = new SbClient();
      const response = await sbClient.signUp(email, password);
      return response;
    }
  })
  .mutation('login', {
    input: z.object({
      email: z.string(),
      password: z.string()
    }),
    async resolve({ input }) {
      const { email, password } = input;
      const sbClient = new SbClient();
      const response = await sbClient.signIn(email, password);
      return response;
    }
  })
  .mutation('logout', {
    async resolve() {
      const sbClient = new SbClient();
      const response = await sbClient.logout();
      return response;
    }
  });

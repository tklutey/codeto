import * as trpc from '@trpc/server';
import GPTClient from 'server/client/GPTClient';
import { z } from 'zod';

export const gpt = trpc.router().query('errorHint', {
  input: z.string(),
  async resolve({ input }) {
    const { error } = JSON.parse(input);
    const gptClient = new GPTClient();
    await gptClient.auth();
    return gptClient.getJavaErrorHint(error);
  }
});

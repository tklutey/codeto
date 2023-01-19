import * as trpc from '@trpc/server';
import GPTClient from 'server/client/GPTClient';
import { z } from 'zod';

export const gpt = trpc
  .router()
  .query('errorHint', {
    input: z.string(),
    async resolve({ input }) {
      const { error } = JSON.parse(input);
      const gptClient = new GPTClient();
      return gptClient.getJavaErrorHint(error);
    }
  })
  .query('askQuestion', {
    input: z.string(),
    async resolve({ input }) {
      const { question } = JSON.parse(input);
      const gptClient = new GPTClient();
      return gptClient.askQuestion(question);
    }
  })
  .query('classifyArticle', {
    input: z.string(),
    async resolve({ input }) {
      const { articleTitle } = JSON.parse(input);
      const gptClient = new GPTClient();
      return gptClient.classifyArticle(articleTitle);
    }
  });

import * as trpc from '@trpc/server';
import { Execute, ExecuteApiFp, InlineResponse200 } from 'server/client/jdoodle-ts-client';
import { z } from 'zod';

const CLIENT_ID = 'ff007312f152182ebdc5b75e7ae71d38';
const CLIENT_SECRET = '604a0c3d63604affe36a7212877989fba277b2afe3a2c8314735b5bda5df167c';

export const executeCode = trpc.router().mutation('post', {
  input: z.object({
    language: z.string(),
    script: z.string(),
    doMock: z.boolean()
  }),
  async resolve({ input }): Promise<InlineResponse200> {
    const { language, script, doMock } = input;

    const execute: Execute = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      script,
      language,
      versionIndex: '0'
    };

    if (doMock) {
      return {
        output: 'Hello, World\n',
        statusCode: 200,
        memory: 24176,
        cpuTime: 0.06
      };
    } else {
      const executeApiFp = ExecuteApiFp();
      const executePost = executeApiFp.executePost(execute);
      const response200 = await executePost();

      return response200;
    }
  }
});

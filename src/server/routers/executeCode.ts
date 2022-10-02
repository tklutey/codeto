import * as trpc from '@trpc/server';
import { Execute, ExecuteApiFp } from 'server/client/jdoodle-ts-client';

export const executeCode = trpc.router().query('get', {
  async resolve() {
    const clientId = 'ff007312f152182ebdc5b75e7ae71d38';
    const clientSecret = '604a0c3d63604affe36a7212877989fba277b2afe3a2c8314735b5bda5df167c';
    const language = 'java';
    const script = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}`;

    const execute: Execute = {
      clientId,
      clientSecret,
      script,
      language,
      versionIndex: '0'
    };

    const executeApiFp = ExecuteApiFp();
    const executePost = executeApiFp.executePost(execute);
    const response200 = await executePost();
    return response200;
  }
});

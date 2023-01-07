import * as trpc from '@trpc/server';
import { z } from 'zod';

export const multipleChoiceProblem = trpc.router().query('getById', {
  input: z.number(),
  async resolve({ input }) {
    return {
      prompt: 'Which of these identifiers is legal as a variable name in Java (i.e. it will compile successfully)?',
      answerOptions: ['1stPlace', 'DAILY TAX RATE', 'while', 'salt&pepper', 'mySocialSecurity$_22']
    };
  }
});

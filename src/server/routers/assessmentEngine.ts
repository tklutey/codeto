import * as trpc from '@trpc/server';
import { z } from 'zod';

export const assessmentEngine = trpc.router().query('getAssessmentState', {
  input: z.string(),
  async resolve({ input }) {
    const { userId, unitNum, prevProblemIndex } = JSON.parse(input);
    const assessmentId = '12345';
    const currentProblem = {
      prompt: 'Which of these identifiers is legal as a variable name in Java (i.e. it will compile successfully)?',
      answerOptions: ['1stPlace', 'DAILY TAX RATE', 'while', 'salt&pepper', 'mySocialSecurity$_22']
    };
    const problemsCompleted = prevProblemIndex + 1;
    const totalProblems = 20;
    return {
      assessmentId,
      currentProblem,
      problemsCompleted,
      totalProblems
    };
  }
});

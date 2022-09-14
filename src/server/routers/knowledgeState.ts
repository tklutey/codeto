import * as trpc from '@trpc/server';

export const knowledgeState = trpc.router().query('get', {
  resolve() {
    return {
      'Primitive Types': 100,
      'Using Objects': 100,
      'Boolean Expressions and if Statements': 100,
      Iteration: 80,
      'Writing Classes': 70,
      Array: 50,
      ArrayList: 30,
      '2D Array': 10,
      Inheritance: 0,
      Recursion: 0
    };
  }
});

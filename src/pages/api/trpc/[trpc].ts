import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

export const appRouter = trpc.router().query('getCurrentKnowledgeState', {
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

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null
});

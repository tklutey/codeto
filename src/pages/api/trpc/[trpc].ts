import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { knowledgeState } from 'pages/server/routers/knowledgeState';

const appRouter = trpc.router().merge('knowledgeState.', knowledgeState);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null
});

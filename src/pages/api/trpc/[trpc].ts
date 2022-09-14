import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { knowledgeState } from 'server/routers/knowledgeState';
import { lesson } from 'server/routers/lesson';

const appRouter = trpc.router().merge('knowledgeState.', knowledgeState).merge('lesson.', lesson);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null
});

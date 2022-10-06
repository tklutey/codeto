import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { executeCode } from 'server/routers/executeCode';
import { knowledgeState } from 'server/routers/knowledgeState';
import { codingProblem } from 'server/routers/codingProblem';

const appRouter = trpc
  .router()
  .merge('knowledgeState.', knowledgeState)
  .merge('codingProblem.', codingProblem)
  .merge('executeCode.', executeCode);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null
});

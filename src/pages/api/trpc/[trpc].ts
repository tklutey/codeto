import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { executeCode } from 'server/routers/executeCode';
import { knowledgeState } from 'server/routers/knowledgeState';
import { codingProblem } from 'server/routers/codingProblem';
import { userHistory } from 'server/routers/userHistory';
import { engine } from 'server/routers/engine';
import { learningStandards } from 'server/routers/learningStandards';
import { gpt } from 'server/routers/gpt';
import { userProblem } from 'server/routers/userProblem';

const appRouter = trpc
  .router()
  .merge('knowledgeState.', knowledgeState)
  .merge('codingProblem.', codingProblem)
  .merge('userHistory.', userHistory)
  .merge('engine.', engine)
  .merge('learningStandards.', learningStandards)
  .merge('gpt.', gpt)
  .merge('userProblem.', userProblem)
  .merge('executeCode.', executeCode);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null
});
